import express from "express";
import { db } from "../db.js";
import admin from "../firebase-admin.js";

const router = express.Router();

// Customer places order
router.post("/place-order", (req, res) => {
  const { items, total } = req.body;

  // 1️⃣ Get admin token from DB
  const sql = "SELECT token FROM admin_tokens LIMIT 1";

  db.query(sql, async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "DB Error", error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "No admin token stored" });
    }

    const adminToken = results[0].token;

    // 2️⃣ Build notification message (Firebase Admin v13 compliant)
    const message = {
      notification: {
        title: "New Order Received",
        body: `Customer ordered ${items.length} items. Total ৳${total}`,
      },
      android: {
        priority: "high", // ✔ correct location
        notification: {
          channelId: "default",
          sound: "default",
        },
      },
      token: adminToken,
    };

    try {
      // 3️⃣ Send notification
      await admin.messaging().send(message);

      res.json({
        success: true,
        message: "Order placed & admin notified successfully",
      });
    } catch (error) {
      console.log("❌ Notification Error:", error);

      // 4️⃣ Handle invalid FCM token (auto-delete)
      if (
        error.errorInfo &&
        error.errorInfo.code === "messaging/registration-token-not-registered"
      ) {
        db.query("DELETE FROM admin_tokens");
        console.log("⚠️ Deleted invalid admin FCM token from DB");
      }

      res.status(500).json({ error: "Notification failed", detail: error });
    }
  });
});

export default router;
