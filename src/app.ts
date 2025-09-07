import express, { type Application } from "express";
import TestRoutes from "./routes/TestRoutes"
import connectDB from "./config/Database";
import Config from "./config/Config"
import LeadRoutes from "./routes/LeadRoutes";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { ResponseMiddleware } from "./middleware/ResponseMiddleware";



const startServer = async () => {
  try {
    await connectDB();

    const app: Application = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //response middleware
    app.use(ResponseMiddleware);

    //routes
    app.use("/test", TestRoutes);
    app.use("/lead", LeadRoutes);


    app.listen(Config.port, () => {
      console.log(`Civil Guruji app listening on port ${Config.port}`);
    });

    //error middleware
    app.use(ErrorHandler);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
