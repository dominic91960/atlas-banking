import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { Decimal } from "decimal.js";
import { randomInt } from "node:crypto";
import { Op } from "sequelize";

import sequelize from "../utils/db.js";
import CustomerAccount from "../models/customer-account.js";
import TransferRequest from "../models/transfer-request.js";
import BankTransaction from "../models/bank-transaction.js";
import { sendTransactionOTP } from "../services/email.service.js";
import { logAudit, getClientIp } from "../services/audit-log.service.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const OTP_SALT_ROUNDS = 12;

const normalizeAccountNumber = (value: unknown): string => {
  return String(value ?? "").trim();
};

const normalizeAmount = (value: unknown): Decimal => {
  return new Decimal(String(value ?? "").trim());
};

export const startTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const senderAccountNumber = String(res.locals.auth.accountNumber);

    const receiverAccountNumber = normalizeAccountNumber(
      req.body.receiverAccountNumber,
    );

    const amount = normalizeAmount(req.body.amount);

    if (senderAccountNumber === receiverAccountNumber) {
      logAudit({
        action: "TRANSFER_START",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: senderAccountNumber,
        details: { reason: "Self-transfer attempt" },
      });

      return res.status(400).json({
        message: "You cannot transfer money to the same account",
      });
    }

    const sender = await CustomerAccount.findByPk(senderAccountNumber);

    if (!sender) {
      logAudit({
        action: "TRANSFER_START",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: senderAccountNumber,
        details: { reason: "Sender account not found" },
      });

      return res.status(404).json({
        message: "The sender account was not found",
      });
    }

    const receiver = await CustomerAccount.findByPk(receiverAccountNumber);

    if (!receiver) {
      logAudit({
        action: "TRANSFER_START",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: receiverAccountNumber,
        details: { reason: "Receiver account not found" },
      });

      return res.status(400).json({
        message: "The receiver account number is invalid",
      });
    }

    const senderBalance = new Decimal(String(sender.getDataValue("balance")));

    if (amount.greaterThan(senderBalance)) {
      logAudit({
        action: "TRANSFER_START",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: senderAccountNumber,
        details: {
          reason: "Insufficient balance",
          amount: amount.toFixed(2),
        },
      });

      return res.status(400).json({
        message: "The account balance is insufficient for this transaction",
      });
    }

    const senderEmail = String(sender.getDataValue("email"));

    const otpCode = randomInt(100000, 1000000).toString();

    const otpHash = await bcrypt.hash(otpCode, OTP_SALT_ROUNDS);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await TransferRequest.update(
      {
        status: "CANCELLED",
      },
      {
        where: {
          sender_account_number: senderAccountNumber,
          status: "PENDING",
        },
      },
    );

    const transferRequest = await TransferRequest.create({
      sender_account_number: senderAccountNumber,

      receiver_account_number: receiverAccountNumber,

      amount: amount.toFixed(2),

      otp_hash: otpHash,
      expires_at: expiresAt,
      attempts: 0,
      status: "PENDING",
    });

    try {
      await sendTransactionOTP(
        senderEmail,
        otpCode,
        receiverAccountNumber,
        amount.toFixed(2),
      );
    } catch (emailError) {
      await transferRequest.update({
        status: "CANCELLED",
      });

      throw emailError;
    }

    logAudit({
      action: "TRANSFER_START",
      status: "SUCCESS",
      userId: Number(res.locals.auth.sub),
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: senderAccountNumber,
      details: {
        transferRequestId: transferRequest.getDataValue("id"),
        amount: amount.toFixed(2),
      },
    });

    return res.status(200).json({
      message:
        "A transaction verification code was sent to your registered email address",

      transferRequestId: transferRequest.getDataValue("id"),

      transaction: {
        receiverAccountNumber: maskAccountNumber(receiverAccountNumber),

        amount: amount.toFixed(2),
      },

      expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyTransactionOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transaction = await sequelize.transaction();

  try {
    const senderAccountNumber = String(res.locals.auth.accountNumber);

    const transferRequestId = String(req.body.transferRequestId ?? "").trim();

    const otpCode = String(req.body.otp ?? "").trim();

    const transferRequest = await TransferRequest.findOne({
      where: {
        id: transferRequestId,
        sender_account_number: senderAccountNumber,
      },

      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!transferRequest) {
      await transaction.rollback();

      logAudit({
        action: "TRANSFER_OTP_VERIFY",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: transferRequestId,
        details: { reason: "Invalid transfer request" },
      });

      return res.status(400).json({
        message: "The transaction request is invalid",
      });
    }

    const status = String(transferRequest.getDataValue("status"));

    if (status !== "PENDING") {
      await transaction.rollback();

      logAudit({
        action: "TRANSFER_OTP_VERIFY",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: transferRequestId,
        details: { reason: "Transfer no longer active", status },
      });

      return res.status(409).json({
        message: "This transaction request is no longer active",
      });
    }

    const expiresAt = new Date(
      transferRequest.getDataValue("expires_at") as string | Date,
    );

    if (expiresAt.getTime() <= Date.now()) {
      await transferRequest.update(
        {
          status: "EXPIRED",
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      logAudit({
        action: "TRANSFER_OTP_VERIFY",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: transferRequestId,
        details: { reason: "OTP expired" },
      });

      return res.status(400).json({
        message: "The transaction verification code has expired",
      });
    }

    const attempts = Number(transferRequest.getDataValue("attempts") ?? 0);

    if (attempts >= MAX_OTP_ATTEMPTS) {
      await transferRequest.update(
        {
          status: "CANCELLED",
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      logAudit({
        action: "TRANSFER_OTP_VERIFY",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: transferRequestId,
        details: { reason: "Too many OTP attempts" },
      });

      return res.status(429).json({
        message:
          "Too many incorrect verification attempts. Start a new transaction.",
      });
    }

    const storedOTPHash = String(transferRequest.getDataValue("otp_hash"));

    const otpMatches = await bcrypt.compare(otpCode, storedOTPHash);

    if (!otpMatches) {
      const newAttempts = attempts + 1;

      await transferRequest.update(
        {
          attempts: newAttempts,

          status: newAttempts >= MAX_OTP_ATTEMPTS ? "CANCELLED" : "PENDING",
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      logAudit({
        action: "TRANSFER_OTP_VERIFY",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: transferRequestId,
        details: {
          reason: "Incorrect OTP",
          attemptsRemaining: Math.max(MAX_OTP_ATTEMPTS - newAttempts, 0),
        },
      });

      return res.status(400).json({
        message: "The transaction verification code is incorrect",

        attemptsRemaining: Math.max(MAX_OTP_ATTEMPTS - newAttempts, 0),
      });
    }

    const receiverAccountNumber = String(
      transferRequest.getDataValue("receiver_account_number"),
    );

    const amount = new Decimal(String(transferRequest.getDataValue("amount")));

    const accountNumbers = [senderAccountNumber, receiverAccountNumber].sort();

    const accounts = await CustomerAccount.findAll({
      where: {
        account_number: {
          [Op.in]: accountNumbers,
        },
      },

      order: [["account_number", "ASC"]],

      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const sender = accounts.find(
      (account) =>
        String(account.getDataValue("account_number")) === senderAccountNumber,
    );

    const receiver = accounts.find(
      (account) =>
        String(account.getDataValue("account_number")) ===
        receiverAccountNumber,
    );

    if (!sender || !receiver) {
      await transaction.rollback();

      return res.status(400).json({
        message: "One of the transaction accounts is invalid",
      });
    }

    const senderBalance = new Decimal(String(sender.getDataValue("balance")));

    const receiverBalance = new Decimal(
      String(receiver.getDataValue("balance")),
    );

    if (amount.greaterThan(senderBalance)) {
      await transferRequest.update(
        {
          status: "CANCELLED",
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      logAudit({
        action: "TRANSFER_OTP_VERIFY",
        status: "FAILURE",
        userId: Number(res.locals.auth.sub),
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        resource: transferRequestId,
        details: {
          reason: "Insufficient balance after lock",
          amount: amount.toFixed(2),
        },
      });

      return res.status(400).json({
        message:
          "The account balance is no longer sufficient for this transaction",
      });
    }

    const updatedSenderBalance = senderBalance.minus(amount);

    const updatedReceiverBalance = receiverBalance.plus(amount);

    await sender.update(
      {
        balance: updatedSenderBalance.toFixed(2),
      },
      {
        transaction,
      },
    );

    await receiver.update(
      {
        balance: updatedReceiverBalance.toFixed(2),
      },
      {
        transaction,
      },
    );

    const completedTransaction = await BankTransaction.create(
      {
        transfer_request_id: transferRequestId,

        sender_account_number: senderAccountNumber,

        receiver_account_number: receiverAccountNumber,

        amount: amount.toFixed(2),

        status: "COMPLETED",

        reference: normalizeReference(req.body.reference),

        sender_balance_after: updatedSenderBalance.toFixed(2),

        receiver_balance_after: updatedReceiverBalance.toFixed(2),
      },
      {
        transaction,
      },
    );

    await transferRequest.update(
      {
        status: "COMPLETED",
        completed_at: new Date(),
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    logAudit({
      action: "TRANSFER_COMPLETE",
      status: "SUCCESS",
      userId: Number(res.locals.auth.sub),
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      resource: senderAccountNumber,
      details: {
        transactionId: completedTransaction.getDataValue("id"),
        amount: amount.toFixed(2),
      },
    });

    return res.status(200).json({
      message: "The transaction was completed successfully",

      transaction: {
        id: completedTransaction.getDataValue("id"),

        receiverAccountNumber: maskAccountNumber(receiverAccountNumber),

        amount: amount.toFixed(2),

        balance: updatedSenderBalance.toFixed(2),

        status: "COMPLETED",

        completedAt: completedTransaction.getDataValue("created_at"),
      },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const getRecentTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accountNumber = String(res.locals.auth.accountNumber);

    const requestedLimit = Number(req.query.limit ?? 10);
    const requestedPage = Number(req.query.page ?? 1);

    const limit = Math.min(
      Math.max(Number.isInteger(requestedLimit) ? requestedLimit : 10, 1),
      50,
    );

    const page = Math.max(
      Number.isInteger(requestedPage) ? requestedPage : 1,
      1,
    );

    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await BankTransaction.findAndCountAll(
      {
        where: {
          status: "COMPLETED",

          [Op.or]: [
            {
              sender_account_number: accountNumber,
            },
            {
              receiver_account_number: accountNumber,
            },
          ],
        },

        order: [["created_at", "DESC"]],

        limit,
        offset,
      },
    );

    const formattedTransactions = transactions.map((transaction) => {
      const senderAccountNumber = String(
        transaction.getDataValue("sender_account_number"),
      );

      const receiverAccountNumber = String(
        transaction.getDataValue("receiver_account_number"),
      );

      const isOutgoing = senderAccountNumber === accountNumber;

      const amount = String(transaction.getDataValue("amount"));

      const balanceAfter = String(
        transaction.getDataValue(
          isOutgoing ? "sender_balance_after" : "receiver_balance_after",
        ),
      );

      const counterpartyAccountNumber = isOutgoing
        ? receiverAccountNumber
        : senderAccountNumber;

      const reference = transaction.getDataValue("reference");

      return {
        id: transaction.getDataValue("id"),

        name:
          reference ||
          (isOutgoing
            ? `Transfer to ${maskAccountNumber(counterpartyAccountNumber)}`
            : `Transfer from ${maskAccountNumber(counterpartyAccountNumber)}`),

        date: transaction.getDataValue("created_at"),

        type: isOutgoing ? "DEBIT" : "CREDIT",

        amount,

        signedAmount: isOutgoing ? `-${amount}` : `+${amount}`,

        balance: balanceAfter,

        counterpartyAccountNumber: maskAccountNumber(counterpartyAccountNumber),

        reference: reference ?? null,

        status: transaction.getDataValue("status"),
      };
    });

    return res.status(200).json({
      transactions: formattedTransactions,

      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const normalizeReference = (value: unknown): string | null => {
  const reference = String(value ?? "").trim();

  return reference ? reference.slice(0, 100) : null;
};

const maskAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length <= 4) {
    return "*".repeat(accountNumber.length);
  }

  return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4);
};
