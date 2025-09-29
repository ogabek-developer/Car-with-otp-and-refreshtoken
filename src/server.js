import express from "express";
import mongoose from "mongoose";
import serverConfig from "./config.js";
import mainRouter from "./routes/main.routes.js";
import multer from "multer";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalError } from "shokhijakhon-error-handler";

const {PORT, SERVERSELECTIONTIMEOUT, DbUri, DB_NAME} = serverConfig;

const app = express();

app.use(cors({
    origin : ["http://127.0.0.1:5500", "http://127.0.0.1:5501"],
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRouter);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message && err.message.includes("Only")) {
    return res.status(400).json({ message: err.message });
  }

  return globalError(err, res);
});

async function bootstrap () {
    try {
        const createDataBase = await mongoose.connect(DbUri, {
            dbName: DB_NAME,
            serverSelectionTimeoutMS: SERVERSELECTIONTIMEOUT
        })
        app.listen(PORT, () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        })
    }catch(err) {
        console.log("DB error", err.message)
    }
}

bootstrap();
