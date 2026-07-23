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

/**
 * Extract the client IP address from the request.
 * Supports proxied requests via the `x-forwarded-for` header.
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    /*
     * x-forwarded-for may contain a comma-separated list.
     * The first entry is the original client IP.
     */
    const firstIp = forwarded.split(",")[0];
    return firstIp ? firstIp.trim() : "unknown";
  }

  return req.ip ?? "unknown";
};

/**
 * Record an audit log entry.
 *
 * This function is fire-and-forget: it writes to the database
 * asynchronously and never throws, so it cannot break request flows.
 */
export const logAudit = (entry: AuditLogEntry): void => {
  AuditLog.create({
    action: entry.action,
    status: entry.status,
    user_id: entry.userId ?? null,
    ip_address: entry.ipAddress,
    user_agent: entry.userAgent ?? null,
    resource: entry.resource ?? null,
    details: entry.details ?? null,
  }).catch((error) => {
    console.error("Failed to write audit log:", error);
  });
};
