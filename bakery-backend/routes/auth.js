import bcrypt from "bcryptjs";
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// 🔹 Registration (for customer signup)
router.post("/register", async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
  INSERT INTO users (name, email, password, role)
  VALUES (?, ?, ?, 'customer')
`;
    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already registered" });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ message: "Registration successful" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Login (admin & customer together)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const user = results[0];
      const validPass = await bcrypt.compare(password, user.password);

      if (!validPass)
        return res.status(401).json({ message: "Invalid credentials" });

      // Differentiate based on role
      if (user.role === "admin") {
        res.json({ message: "Admin login successful", role: "admin", user });
      } else {
        res.json({
          message: "Customer login successful",
          role: "customer",
          user,
        });
      }
    }
  );
});

export default router;
