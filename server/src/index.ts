import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import helmet from "helmet";

import { generalLimiter } from "./middleware/rate-limit.js";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error-handler.js";
import sequelize from "./utils/db.js";
import transactionRoutes from "./routes/transaction.routes.js";
import "./models/audit-log.js";

const app: Application = express();
const PORT = process.env.PORT!;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN!;

app.set("trust proxy", 1);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(generalLimiter);

// Root GET Route
app.get("/", (_: Request, res: Response) => {
  res.status(200).json({ message: "Server is running successfully." });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Transaction Routes
app.use("/api/transactions", transactionRoutes);

// 404 Route
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT);
  } catch (err) {
    console.error("Unable to start the server:", err);
  }
};
startServer();
