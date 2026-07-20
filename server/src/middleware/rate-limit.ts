import rateLimit from "express-rate-limit";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests, please try again in 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { generalLimiter };
