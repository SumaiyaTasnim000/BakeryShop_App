import { exec } from "child_process";
import express from "express";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { db } from "../db.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items to print" });
  }

  db.query(
    "INSERT INTO sales (total_amount) VALUES (?)",
    [total],
    (err, saleResult) => {
      if (err) {
        console.error("❌ Sale insert failed:", err);
        return res.status(500).json({ error: "Failed to save sale" });
      }

      const saleId = saleResult.insertId;
      const values = items.map((item) => [saleId, item.id, item.quantity]);

      db.query(
        "INSERT INTO sales_items (sale_id, product_id, quantity) VALUES ?",
        [values],
        (err2) => {
          if (err2) {
            console.error("❌ Sale items insert failed:", err2);
            return res.status(500).json({ error: "Failed to save sale items" });
          }

          /* ===============================
             SAFE TEMP FILE (IMPORTANT)
          =============================== */

          const receiptPath = path.join(
            process.env.TEMP || "C:\\Windows\\Temp",
            `receipt-${Date.now()}.pdf`
          );

          console.log("📝 Creating PDF:", receiptPath);

          const doc = new PDFDocument({
            size: "A4",
            margin: 40,
            compress: false,
          });

          const stream = fs.createWriteStream(receiptPath);

          stream.on("error", (e) => {
            console.error("❌ Stream error:", e);
          });

          doc.pipe(stream);
          doc.font("Helvetica");

          doc.fontSize(18).text("Sora’s Bakery", { align: "center" });
          doc.moveDown(0.5);
          doc.fontSize(10).text(new Date().toLocaleString(), {
            align: "center",
          });
          doc.moveDown();

          doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown();

          items.forEach((item) => {
            doc.text(
              `${item.name}   x${item.quantity}   Tk ${
                item.price * item.quantity
              }`
            );
          });

          doc.moveDown();
          doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown();

          doc.text(`TOTAL: Tk ${total}`, { align: "right" });
          doc.moveDown();
          doc.text("Thank you for your purchase!", { align: "center" });

          doc.end();

          /* ===============================
             PRINT AFTER FILE EXISTS
          =============================== */

          stream.on("finish", () => {
            console.log("✅ PDF written:", receiptPath);

            const sumatra = `"C:\\Users\\X1 CARBON\\AppData\\Local\\SumatraPDF\\SumatraPDF.exe"`;

            const command = `${sumatra} -print-to-default "${receiptPath}"`;

            // HARD delay for Windows spooler
            setTimeout(() => {
              console.log("🖨️ Printing...");
              exec(command, (error) => {
                if (error) {
                  console.error("❌ Print error:", error);
                  return res.status(500).json({ error: "Print failed" });
                }

                console.log("✅ Printed successfully");
                res.json({ message: "Printed & sale recorded" });
              });
            }, 1500);
          });
        }
      );
    }
  );
});

export default router;
