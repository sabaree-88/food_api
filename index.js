import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import foodRoute from "./routes/foodRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(function (err, req, res, next) {
  console.log("This is the invalid field ->", err.field);
  next(err);
});

app.get("/", (req, res) => {
  return res.json({ message: "From API" });
});

app.use("/user", userRouter);
app.use("/food-cat", categoryRouter);
app.use("/food", foodRoute);

// connect the database and run the server
const PORT = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`App is running: http://localhost:${PORT}`);
  });
  console.log("Database Connected");
});
