import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notification.js";
import orderRoutes from "./routes/order.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api", notificationRoutes);
app.use("/api", orderRoutes);

const PORT = process.env.PORT || 5000;

// ✅ FIXED LISTEN FUNCTION
app.listen(PORT, () => {
  console.log("🚀 Server listening on:", PORT);
  console.log("🌍 Bound to 0.0.0.0 (all interfaces enabled)");
});
