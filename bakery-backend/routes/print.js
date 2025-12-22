import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { db } from "../db.js";

const router = express.Router();

// ESC/POS commands
const ESC = "\x1B";
const INIT = ESC + "@";
const CUT = ESC + "i";

router.post("/", (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Empty cart" });
  }

  // 1️⃣ Save sale
  db.query(
    "INSERT INTO sales (total_amount) VALUES (?)",
    [total],
    (err, saleResult) => {
      if (err) return res.status(500).json({ error: "Sale insert failed" });

      const saleId = saleResult.insertId;
      const values = items.map(i => [saleId, i.id, i.quantity]);

      // 2️⃣ Save sale items
      db.query(
        "INSERT INTO sales_items (sale_id, product_id, quantity) VALUES ?",
        [values],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: "Sale items insert failed" });

          // 3️⃣ Build receipt (80mm)
          let receipt =
            INIT +
            "Sora's Bakery\n" +
            "-----------------------------\n" +
            `Order #${saleId}\n` +
            new Date().toLocaleString() +
            "\n\n";

          items.forEach(item => {
            receipt += `${item.name}\n`;
            receipt += `  x${item.quantity}  Tk ${item.price * item.quantity}\n`;
          });

          receipt +=
            "\n-----------------------------\n" +
            `TOTAL: Tk ${total}\n\n` +
            "Thank you for your purchase!\n\n" +
            CUT;

          // 4️⃣ Write RAW file
          const rawPath = path.join(
            process.env.USERPROFILE,
            `receipt-${saleId}.raw`
          );
          fs.writeFileSync(rawPath, receipt, "binary");

          // 5️⃣ Print via shared printer
          const printer = `\\\\${process.env.COMPUTERNAME}\\PP8800`;

          exec(`copy /b "${rawPath}" "${printer}"`, (err3) => {
            if (err3) {
              console.error(err3);
              return res.status(500).json({ error: "Print failed" });
            }

            res.json({ success: true, saleId });
          });
        }
      );
    }
  );
});

export default router;
