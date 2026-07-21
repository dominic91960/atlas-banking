import {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";
import sequelize from "../utils/db.js";
import CustomerAccount from "../models/customer-account.js";
import User from "../models/user.js";
import OTP from "../models/otp.js";
import { sendRegistrationOTP } from "../services/email.service.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const PASSWORD_SALT_ROUNDS = 12;

const normalizeAccountNumber = (value: unknown): string => {
  return String(value ?? "").trim();
};

const normalizeNIC = (value: unknown): string => {
  return String(value ?? "").trim().toUpperCase();
};

const normalizeUsername = (value: unknown): string => {
  return String(value ?? "").trim().toLowerCase();
};

/**
 * Step 1:
 * Check the account number and NIC.
 * Generate and email an OTP.
 */
export const startRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountNumber = normalizeAccountNumber(req.body.accountNumber);
    const nic = normalizeNIC(req.body.nic);

    const customer = await CustomerAccount.findOne({
      where: {
        account_number: accountNumber,
        nic,
      },
    });

    if (!customer) {
      return res.status(400).json({
        message: "The provided account details could not be verified",
      });
    }

    const existingUser = await User.findOne({
      where: {
        account_number: accountNumber,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An online banking account already exists",
      });
    }

    /*
     * crypto.randomInt is more suitable for security-sensitive random
     * values than Math.random().
     */
    const otpCode = randomInt(100000, 1000000).toString();

    const otpHash = await bcrypt.hash(
      otpCode,
      PASSWORD_SALT_ROUNDS
    );

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await OTP.upsert({
      account_number: accountNumber,
      otp_code: otpHash,
      expires_at: expiresAt,
      verified: false,
      attempts: 0,
    });

    const email = String(customer.getDataValue("email"));

    try {
      await sendRegistrationOTP(email, otpCode);
    } catch (emailError) {
      /*
       * Delete the OTP when email delivery fails.
       * This prevents a registration flow from being left in an
       * unusable state.
       */
      await OTP.destroy({
        where: {
          account_number: accountNumber,
        },
      });

      throw emailError;
    }

    return res.status(200).json({
      message: "A verification code was sent to the registered email address",
      email: maskEmail(email),
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 2:
 * Verify the OTP entered by the customer.
 */
export const verifyRegistrationOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountNumber = normalizeAccountNumber(req.body.accountNumber);
    const otpCode = String(req.body.otp ?? "").trim();

    const otpRecord = await OTP.findOne({
      where: {
        account_number: accountNumber,
      },
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "No active verification request was found",
      });
    }

    const verified = Boolean(otpRecord.getDataValue("verified"));

    if (verified) {
      return res.status(409).json({
        message: "This verification code has already been verified",
      });
    }

    const expiresAt = new Date(
      otpRecord.getDataValue("expires_at") as string | Date
    );

    if (expiresAt.getTime() <= Date.now()) {
      await OTP.destroy({
        where: {
          account_number: accountNumber,
        },
      });

      return res.status(400).json({
        message: "The verification code has expired",
      });
    }

    const attempts = Number(
      otpRecord.getDataValue("attempts") ?? 0
    );

    if (attempts >= MAX_OTP_ATTEMPTS) {
      await OTP.destroy({
        where: {
          account_number: accountNumber,
        },
      });

      return res.status(429).json({
        message:
          "Too many incorrect verification attempts. Request a new code.",
      });
    }

    const storedOTPHash = String(
      otpRecord.getDataValue("otp_code")
    );

    const otpMatches = await bcrypt.compare(
      otpCode,
      storedOTPHash
    );

    if (!otpMatches) {
      await otpRecord.update({
        attempts: attempts + 1,
      });

      return res.status(400).json({
        message: "The verification code is incorrect",
        attemptsRemaining:
          MAX_OTP_ATTEMPTS - (attempts + 1),
      });
    }

    await otpRecord.update({
      verified: true,
    });

    return res.status(200).json({
      message: "Email address verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 3:
 * Create the online banking account after successful OTP verification.
 */
export const completeRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const accountNumber = normalizeAccountNumber(
      req.body.accountNumber
    );

    const username = normalizeUsername(req.body.username);
    const password = String(req.body.password ?? "");

    const customer = await CustomerAccount.findOne({
      where: {
        account_number: accountNumber,
      },
      transaction,
    });

    if (!customer) {
      await transaction.rollback();

      return res.status(400).json({
        message: "The customer account could not be verified",
      });
    }

    const otpRecord = await OTP.findOne({
      where: {
        account_number: accountNumber,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!otpRecord) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Complete OTP verification before creating an account",
      });
    }

    const otpVerified = Boolean(
      otpRecord.getDataValue("verified")
    );

    const expiresAt = new Date(
      otpRecord.getDataValue("expires_at") as string | Date
    );

    if (!otpVerified || expiresAt.getTime() <= Date.now()) {
      await transaction.rollback();

      return res.status(400).json({
        message:
          "OTP verification is incomplete or has expired",
      });
    }

    const existingAccountUser = await User.findOne({
      where: {
        account_number: accountNumber,
      },
      transaction,
    });

    if (existingAccountUser) {
      await transaction.rollback();

      return res.status(409).json({
        message: "An online banking account already exists",
      });
    }

    const existingUsername = await User.findOne({
      where: {
        username,
      },
      transaction,
    });

    if (existingUsername) {
      await transaction.rollback();

      return res.status(409).json({
        message: "This username is already in use",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      PASSWORD_SALT_ROUNDS
    );

    const newUser = await User.create(
      {
        account_number: accountNumber,
        username,
        password_hash: passwordHash,
        is_verified: true,
      },
      {
        transaction,
      }
    );

    /*
     * OTP should only be usable once.
     */
    await OTP.destroy({
      where: {
        account_number: accountNumber,
      },
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      message: "Online banking account created successfully",
      user: {
        id: newUser.getDataValue("id"),
        accountNumber:
          newUser.getDataValue("account_number"),
        username: newUser.getDataValue("username"),
      },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Sign in:
 * Check username and password and return a JWT.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = normalizeUsername(req.body.username);
    const password = String(req.body.password ?? "");

    const user = await User.findOne({
      where: {
        username,
      },
    });

    /*
     * Use the same response for an invalid username and invalid password
     * so the API does not reveal which usernames exist.
     */
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordHash = String(
      user.getDataValue("password_hash")
    );

    const passwordMatches = await bcrypt.compare(
      password,
      passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const isVerified = Boolean(
      user.getDataValue("is_verified")
    );

    if (!isVerified) {
      return res.status(403).json({
        message: "This account has not been verified",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        sub: String(user.getDataValue("id")),
        accountNumber: String(
          user.getDataValue("account_number")
        ),
        username: String(user.getDataValue("username")),
      },
      jwtSecret,
      {
        algorithm: "HS256",
        expiresIn: "15m",
        issuer: "atlas-banking-api",
        audience: "atlas-banking-client",
      }
    );

    return res.status(200).json({
      message: "Signed in successfully",
      token,
      expiresIn: 900,
      user: {
        id: user.getDataValue("id"),
        accountNumber:
          user.getDataValue("account_number"),
        username: user.getDataValue("username"),
      },
    });
  } catch (error) {
    next(error);
  }
};

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return "registered email address";
  }

  const visibleCharacters = localPart.slice(0, 2);
  const hiddenCharacters = "*".repeat(
    Math.max(localPart.length - 2, 3)
  );

  return `${visibleCharacters}${hiddenCharacters}@${domain}`;
};