import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app: Application = express();

app.use(cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));