import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/sales", (req, res) => {
  const query = `
    SELECT 
      p.id,
      p.name,
      SUM(si.quantity) AS sold
    FROM sales_items si
    JOIN products p ON si.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY sold DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Stats fetch failed" });
    }

    res.json(results);
  });
});

export default router;
