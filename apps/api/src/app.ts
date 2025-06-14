import express, { Application } from "express";
import router from "./routes";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", router);
export default app;
