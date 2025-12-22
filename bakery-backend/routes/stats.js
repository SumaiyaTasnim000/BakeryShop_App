import express from "express";
import { db } from "../db.js";

const router = express.Router();

/* ===============================
   📊 ALL SALES (Admin Stats Page)
================================ */
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

    res.json(Array.isArray(results) ? results : []);
  });
});

/* ===============================
   ⭐ TOP 3 BEST SELLING PRODUCTS
   (Used by Home page – admin + customer)
================================ */
router.get("/top-products", (req, res) => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.price,
      p.image,
      SUM(si.quantity) AS sold
    FROM sales_items si
    JOIN products p ON si.product_id = p.id
    GROUP BY p.id, p.name, p.price, p.image
    ORDER BY sold DESC
    LIMIT 3
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.json([]); // ALWAYS return array
    }

    res.json(Array.isArray(results) ? results : []);
  });
});

export default router;
