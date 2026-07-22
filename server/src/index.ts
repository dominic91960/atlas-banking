import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import "dotenv/config";
import cors from "cors";
import errorHandler from "./middleware/error-handler.js";
import sequelize from "./utils/db.js";
import { generalLimiter } from "./middleware/rate-limit.js";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

// MUST REMOVE: db test
import Employee from "./models/employee.js";

const app: Application = express();
const PORT = process.env.PORT!;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN!;

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);
app.use(generalLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(
  express.json({
    limit: "20kb",
  })
);

// Root GET Route
app.get("/", (_: Request, res: Response) => {
  res.status(200).json({ message: "Server is running successfully." });
});

// MUST REMOVE: db test route
app.get("/test", async (_, res, next) => {
  try {
    const users = await Employee.findAll();
    const data = users.map((user) => user.toJSON());

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);

// 404 Route
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`Application is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Unable to connect to the database:", err);
  }
};
startServer();
