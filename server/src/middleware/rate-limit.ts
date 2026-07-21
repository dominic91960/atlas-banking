import rateLimit from "express-rate-limit";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registrationStartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    message:
      "Too many verification code requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    message:
      "Too many verification attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    message:
      "Too many sign-in attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export {
  generalLimiter,
  registrationStartLimiter,
  otpVerificationLimiter,
  loginLimiter,
};