import express from "express";
import { db } from "../db.js";
import admin from "../firebase-admin.js";

const router = express.Router();

/**
 * Save Admin FCM Token
 */
router.post("/save-admin-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  const deleteOld = "DELETE FROM admin_tokens";
  const insert = "INSERT INTO admin_tokens (token) VALUES (?)";

  db.query(deleteOld, () => {
    db.query(insert, [token], (err) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ message: "Admin token saved" });
    });
  });
});

/**
 * Send FCM Notification to Admin
 */
router.post("/send-admin-notification", async (req, res) => {
  const title = req.body.title || "New Order";
  const body = req.body.body || "A customer confirmed an order.";

  db.query("SELECT token FROM admin_tokens LIMIT 1", async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0)
      return res.status(400).json({ message: "No admin token saved" });

    const adminToken = results[0].token;

    const message = {
      token: adminToken,
      notification: {
        title,
        body,
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("📩 FCM Sent:", response);
      res.json({ message: "Notification sent", response });
    } catch (error) {
      console.log("❌ FCM Error:", error);
      res.status(500).json({ message: "FCM error", error });
    }
  });
});

export default router;
