import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomInt, randomBytes, createHash } from "node:crypto";
import sequelize from "../utils/db.js";
import CustomerAccount from "../models/customer-account.js";
import User from "../models/user.js";
import OTP from "../models/otp.js";
import {
  sendRegistrationOTP,
  sendPasswordResetEmail,
} from "../services/email.service.js";
import PasswordReset from "../models/password-reset.js";
import { logAudit, getClientIp } from "../services/audit-log.service.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const PASSWORD_SALT_ROUNDS = 12;

const DEFAULT_PASSWORD_RESET_EXPIRY_MINUTES = 15;

const PASSWORD_RESET_EXPIRY_MINUTES = Number(
  process.env.PASSWORD_RESET_EXPIRY_MINUTES ??
    DEFAULT_PASSWORD_RESET_EXPIRY_MINUTES,
);

const normalizeAccountNumber = (value: unknown): string => {
  return String(value ?? "").trim();
};

const normalizeNIC = (value: unknown): string => {
  return String(value ?? "")
    .trim()
    .toUpperCase();
};

const normalizeUsername = (value: unknown): string => {
  return String(value ?? "")
    .trim()
    .toLowerCase();
};

const normalizeEmail = (value: unknown): string => {
  return String(value ?? "")
    .trim()
    .toLowerCase();
};

const hashResetToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const startRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
      logAudit({
        action: "REGISTRATION_START",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: { reason: "Invalid account details" },
      });

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
      logAudit({
        action: "REGISTRATION_START",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: { reason: "Account already registered" },
      });

      return res.status(409).json({
        message: "An online banking account already exists",
      });
    }

    const otpCode = randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otpCode, PASSWORD_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

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
      await OTP.destroy({
        where: {
          account_number: accountNumber,
        },
      });

      throw emailError;
    }

    logAudit({
      action: "REGISTRATION_START",
      status: "SUCCESS",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: accountNumber,
    });

    return res.status(200).json({
      message: "A verification code was sent to the registered email address",
      email: maskEmail(email),
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyRegistrationOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
      logAudit({
        action: "REGISTRATION_OTP_VERIFY",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: { reason: "No active verification request" },
      });

      return res.status(400).json({
        message: "No active verification request was found",
      });
    }

    const verified = Boolean(otpRecord.getDataValue("verified"));

    if (verified) {
      logAudit({
        action: "REGISTRATION_OTP_VERIFY",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: { reason: "OTP already verified" },
      });

      return res.status(409).json({
        message: "This verification code has already been verified",
      });
    }

    const expiresAt = new Date(
      otpRecord.getDataValue("expires_at") as string | Date,
    );

    if (expiresAt.getTime() <= Date.now()) {
      await OTP.destroy({
        where: {
          account_number: accountNumber,
        },
      });

      logAudit({
        action: "REGISTRATION_OTP_VERIFY",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: { reason: "OTP expired" },
      });

      return res.status(400).json({
        message: "The verification code has expired",
      });
    }

    const attempts = Number(otpRecord.getDataValue("attempts") ?? 0);

    if (attempts >= MAX_OTP_ATTEMPTS) {
      await OTP.destroy({
        where: {
          account_number: accountNumber,
        },
      });

      logAudit({
        action: "REGISTRATION_OTP_VERIFY",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: { reason: "Too many OTP attempts" },
      });

      return res.status(429).json({
        message:
          "Too many incorrect verification attempts. Request a new code.",
      });
    }

    const storedOTPHash = String(otpRecord.getDataValue("otp_code"));

    const otpMatches = await bcrypt.compare(otpCode, storedOTPHash);

    if (!otpMatches) {
      await otpRecord.update({
        attempts: attempts + 1,
      });

      logAudit({
        action: "REGISTRATION_OTP_VERIFY",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: {
          reason: "Incorrect OTP",
          attemptsRemaining: MAX_OTP_ATTEMPTS - (attempts + 1),
        },
      });

      return res.status(400).json({
        message: "The verification code is incorrect",
        attemptsRemaining: MAX_OTP_ATTEMPTS - (attempts + 1),
      });
    }

    await otpRecord.update({
      verified: true,
    });

    logAudit({
      action: "REGISTRATION_OTP_VERIFY",
      status: "SUCCESS",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: accountNumber,
    });

    return res.status(200).json({
      message: "Email address verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const completeRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transaction = await sequelize.transaction();

  try {
    const accountNumber = normalizeAccountNumber(req.body.accountNumber);

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

    const otpVerified = Boolean(otpRecord.getDataValue("verified"));

    const expiresAt = new Date(
      otpRecord.getDataValue("expires_at") as string | Date,
    );

    if (!otpVerified || expiresAt.getTime() <= Date.now()) {
      await transaction.rollback();

      return res.status(400).json({
        message: "OTP verification is incomplete or has expired",
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

    const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

    const newUser = await User.create(
      {
        account_number: accountNumber,
        username,
        password_hash: passwordHash,
        is_verified: true,
      },
      {
        transaction,
      },
    );

    await OTP.destroy({
      where: {
        account_number: accountNumber,
      },
      transaction,
    });

    await transaction.commit();

    logAudit({
      action: "REGISTRATION_COMPLETE",
      status: "SUCCESS",
      userId: newUser.getDataValue("id") as number,
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: accountNumber,
    });

    return res.status(201).json({
      message: "Online banking account created successfully",
      user: {
        id: newUser.getDataValue("id"),
        accountNumber: newUser.getDataValue("account_number"),
        username: newUser.getDataValue("username"),
      },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const username = normalizeUsername(req.body.username);
    const password = String(req.body.password ?? "");

    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      logAudit({
        action: "LOGIN",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        details: { reason: "Invalid username" },
      });

      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordHash = String(user.getDataValue("password_hash"));

    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (!passwordMatches) {
      logAudit({
        action: "LOGIN",
        status: "FAILURE",
        userId: user.getDataValue("id") as number,
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        details: { reason: "Invalid password" },
      });

      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const isVerified = Boolean(user.getDataValue("is_verified"));

    if (!isVerified) {
      logAudit({
        action: "LOGIN",
        status: "FAILURE",
        userId: user.getDataValue("id") as number,
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        details: { reason: "Account not verified" },
      });

      return res.status(403).json({
        message: "This account has not been verified",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    if (!refreshTokenSecret) {
      throw new Error("REFRESH_TOKEN_SECRET is not configured");
    }

    const userId = String(user.getDataValue("id"));
    const accountNumber = String(user.getDataValue("account_number"));
    const storedUsername = String(user.getDataValue("username"));

    const accessToken = jwt.sign(
      {
        sub: userId,
        accountNumber,
        username: storedUsername,
      },
      jwtSecret,
      {
        algorithm: "HS256",
        expiresIn: "15m",
        issuer: "atlas-banking-api",
        audience: "atlas-banking-client",
      },
    );

    const refreshToken = jwt.sign(
      {
        sub: userId,
        accountNumber,
        username: storedUsername,
      },
      refreshTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: "7d",
        issuer: "atlas-banking-api",
        audience: "atlas-banking-client",
      },
    );

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SEVEN_DAYS_MS,
      path: "/",
    });

    logAudit({
      action: "LOGIN",
      status: "SUCCESS",
      userId: Number(userId),
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: accountNumber,
    });

    return res.status(200).json({
      message: "Signed in successfully",
      accessToken,
      expiresIn: 900,
      user: {
        id: userId,
        accountNumber,
        username: storedUsername,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Authentication is required",
      });
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const jwtSecret = process.env.JWT_SECRET;

    if (!refreshTokenSecret || !jwtSecret) {
      throw new Error("Token secrets are not configured");
    }

    let payload: jwt.JwtPayload;

    try {
      const decoded = jwt.verify(refreshToken, refreshTokenSecret, {
        algorithms: ["HS256"],
        issuer: "atlas-banking-api",
        audience: "atlas-banking-client",
      });

      if (typeof decoded === "string") {
        return res.status(401).json({
          message: "The refresh token is invalid",
        });
      }

      payload = decoded;
    } catch {
      return res.status(401).json({
        message: "The refresh token is invalid or has expired",
      });
    }

    const user = await User.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "The user account no longer exists",
      });
    }

    const userId = String(user.getDataValue("id"));
    const accountNumber = String(user.getDataValue("account_number"));
    const username = String(user.getDataValue("username"));

    const accessToken = jwt.sign(
      {
        sub: userId,
        accountNumber,
        username,
      },
      jwtSecret,
      {
        algorithm: "HS256",
        expiresIn: "15m",
        issuer: "atlas-banking-api",
        audience: "atlas-banking-client",
      },
    );

    return res.status(200).json({
      accessToken,
      user: {
        id: userId,
        accountNumber,
        username,
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
  const hiddenCharacters = "*".repeat(Math.max(localPart.length - 2, 3));

  return `${visibleCharacters}${hiddenCharacters}@${domain}`;
};

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const genericResponse = {
    message:
      "If the provided details match an account, a password-reset link will be sent to the registered email address",
  };

  try {
    const username = normalizeUsername(req.body.username);
    const accountNumber = normalizeAccountNumber(req.body.accountNumber);
    const email = normalizeEmail(req.body.email);

    const user = await User.findOne({
      where: {
        username,
        account_number: accountNumber,
      },
    });

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const customer = await CustomerAccount.findOne({
      where: {
        account_number: accountNumber,
      },
    });

    if (!customer) {
      return res.status(200).json(genericResponse);
    }

    const registeredEmail = normalizeEmail(customer.getDataValue("email"));

    if (registeredEmail !== email) {
      return res.status(200).json(genericResponse);
    }

    const passwordResetURL = process.env.PASSWORD_RESET_URL;

    if (!passwordResetURL) {
      throw new Error("PASSWORD_RESET_URL is not configured");
    }

    const resetToken = randomBytes(32).toString("hex");
    const tokenHash = hashResetToken(resetToken);

    const expiresAt = new Date(
      Date.now() + PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000,
    );

    await PasswordReset.upsert({
      account_number: accountNumber,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    const resetLink =
      `${passwordResetURL}?token=` + encodeURIComponent(resetToken);

    try {
      await sendPasswordResetEmail(
        registeredEmail,
        resetLink,
        PASSWORD_RESET_EXPIRY_MINUTES,
      );
    } catch (emailError) {
      await PasswordReset.destroy({
        where: {
          account_number: accountNumber,
          token_hash: tokenHash,
        },
      });

      throw emailError;
    }

    logAudit({
      action: "PASSWORD_RESET_REQUEST",
      status: "SUCCESS",
      userId: user.getDataValue("id") as number,
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: accountNumber,
    });

    return res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transaction = await sequelize.transaction();

  try {
    const resetToken = String(req.body.token ?? "").trim();

    const newPassword = String(req.body.password ?? "");

    const tokenHash = hashResetToken(resetToken);

    const resetRecord = await PasswordReset.findOne({
      where: {
        token_hash: tokenHash,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!resetRecord) {
      await transaction.rollback();

      return res.status(400).json({
        message: "The password-reset link is invalid or has already been used",
      });
    }

    const expiresAt = new Date(
      resetRecord.getDataValue("expires_at") as string | Date,
    );

    if (expiresAt.getTime() <= Date.now()) {
      await PasswordReset.destroy({
        where: {
          token_hash: tokenHash,
        },
        transaction,
      });

      await transaction.commit();

      return res.status(400).json({
        message: "The password-reset link has expired. Request a new link.",
      });
    }

    const accountNumber = String(resetRecord.getDataValue("account_number"));

    const user = await User.findOne({
      where: {
        account_number: accountNumber,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      await PasswordReset.destroy({
        where: {
          token_hash: tokenHash,
        },
        transaction,
      });

      await transaction.commit();

      return res.status(400).json({
        message: "The password-reset request is invalid",
      });
    }

    const currentPasswordHash = String(user.getDataValue("password_hash"));

    const sameAsCurrentPassword = await bcrypt.compare(
      newPassword,
      currentPasswordHash,
    );

    if (sameAsCurrentPassword) {
      await transaction.rollback();

      logAudit({
        action: "PASSWORD_RESET_COMPLETE",
        status: "FAILURE",
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: accountNumber,
        details: { reason: "Same as current password" },
      });

      return res.status(400).json({
        message: "The new password must be different from the current password",
      });
    }

    const newPasswordHash = await bcrypt.hash(
      newPassword,
      PASSWORD_SALT_ROUNDS,
    );

    await user.update(
      {
        password_hash: newPasswordHash,
      },
      {
        transaction,
      },
    );

    await PasswordReset.destroy({
      where: {
        account_number: accountNumber,
      },
      transaction,
    });

    await transaction.commit();

    logAudit({
      action: "PASSWORD_RESET_COMPLETE",
      status: "SUCCESS",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: accountNumber,
    });

    return res.status(200).json({
      message:
        "Your password has been reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    logAudit({
      action: "LOGOUT",
      status: "SUCCESS",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
    });

    return res.status(200).json({
      message: "Signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};
