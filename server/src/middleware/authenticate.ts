import { type RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface AuthenticationPayload extends JwtPayload {
  sub: string;
  accountNumber: string;
  username: string;
}

const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.header("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication is required",
    });
  }

  const token = authorization.slice(7).trim();
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(new Error("JWT_SECRET is not configured"));
  }

  try {
    const payload = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"],
      issuer: "atlas-banking-api",
      audience: "atlas-banking-client",
    });

    if (
      typeof payload === "string" ||
      !payload.sub ||
      !payload.accountNumber ||
      !payload.username
    ) {
      return res.status(401).json({
        message: "The authentication token is invalid",
      });
    }

    res.locals.auth = payload as AuthenticationPayload;

    next();
  } catch {
    return res.status(401).json({
      message: "The authentication token is invalid or has expired",
    });
  }
};

export default authenticate;
