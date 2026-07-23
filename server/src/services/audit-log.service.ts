import { type Request } from "express";
import AuditLog from "../models/audit-log.js";

interface AuditLogEntry {
  action: string;
  status: "SUCCESS" | "FAILURE";
  userId?: number | string | null | undefined;
  ipAddress: string;
  userAgent?: string | null | undefined;
  resource?: string | null | undefined;
  details?: Record<string, unknown> | null | undefined;
}

export const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    const firstIp = forwarded.split(",")[0];
    return firstIp ? firstIp.trim() : "unknown";
  }

  return req.ip ?? "unknown";
};

export const logAudit = (entry: AuditLogEntry): void => {
  AuditLog.create({
    action: entry.action,
    status: entry.status,
    user_id: entry.userId ?? null,
    ip_address: entry.ipAddress,
    user_agent: entry.userAgent ?? null,
    resource: entry.resource ?? null,
    details: entry.details ?? null,
  }).catch();
};
