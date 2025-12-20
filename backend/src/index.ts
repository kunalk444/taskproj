import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";

import authRouter from "./routes/auth";
import taskRouter from "./routes/tasks";
import { authmiddleware } from "./middleware";
import { initSocket } from "./services/socket";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL!;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected via Mongoose");

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
        origin: process.env.NODE_ENV === "production"
            ? true             
        : "http://localhost:5173",
        credentials: true,
      })
    );

    app.use("/auth", authRouter);
    app.use("/tasks", authmiddleware, taskRouter);

    app.post("/", (req, res) => {
      const { email, password } = req.body;
      res.json({ email, password, from: "backend" });
    });

    const rootDir = process.cwd();

    app.use(
    express.static(path.join(rootDir, "../frontend/dist"))
    );

    app.use((req, res) => {
        res.sendFile(
            path.join(process.cwd(), "../frontend/dist/index.html")
        );
    });



    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

startServer();
