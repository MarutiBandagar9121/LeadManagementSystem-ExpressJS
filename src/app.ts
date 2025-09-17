import express, { type Application } from "express";
import TestRoutes from "./routes/TestRoutes"
import LeadRoutes from "./routes/LeadRoutes";
import UserRoutes from "./routes/UserRoutes";
import connectDB from "./config/Database";
import { connectToRedis } from "./config/redis";
import Config from "./config/Config"
import { ErrorHandler } from "./middleware/ErrorHandler";
import { ResponseMiddleware } from "./middleware/ResponseMiddleware";
import cookieParser from "cookie-parser";


const startServer = async () => {
  try {
    await connectDB();
    await connectToRedis();

    const app: Application = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    //response middleware
    app.use(ResponseMiddleware);

    //routes
    app.use("/api/test", TestRoutes);
    app.use("/api/lead", LeadRoutes);
    app.use("/api/user", UserRoutes);


    app.listen(Config.port, () => {
      console.log(`Lead Management app listening on port ${Config.port}`);
    });

    //error middleware
    app.use(ErrorHandler);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
