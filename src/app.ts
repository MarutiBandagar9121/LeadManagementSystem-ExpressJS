import express, { type Application } from "express";
import TestRoutes from "./routes/TestRoutes"
import connectDB from "./config/Database";
import Config from "./config/Config"
import LeadRoutes from "./routes/LeadRoutes";
import { errorHandler } from "./middleware/ErrorHandler";



const startServer = async () => {
  try {
    await connectDB();

    const app: Application = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/test", TestRoutes);
    app.use("/lead", LeadRoutes);


    app.listen(Config.port, () => {
      console.log(`Civil Guruji app listening on port ${Config.port}`);
    });

    //middleware
    app.use(errorHandler);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
