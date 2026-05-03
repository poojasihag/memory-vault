import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { startCronJobs } from "./config/cron.js";

dotenv.config();

const app: Application = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5174",
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);

// Global Error Handler
app.use(errorHandler);

// Start cron jobs
startCronJobs();

import serverless from "serverless-http";

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export const handler = serverless(app);