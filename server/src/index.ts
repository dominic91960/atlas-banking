import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { config } from "dotenv";
import { generalLimiter } from "./middleware/rate-limit.js";

config({ quiet: true });
const app: Application = express();
const PORT = process.env.PORT;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

app.use(express.json());
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(generalLimiter);

app.get("/", (_: Request, res: Response) => {
  res.status(200).json({ message: "Server is running successfully." });
});

app.listen(PORT, () => {
  console.log(`Application is running at http://localhost:${PORT}`);
});
