import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.js";
import printRoutes from "./routes/print.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/print", printRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
