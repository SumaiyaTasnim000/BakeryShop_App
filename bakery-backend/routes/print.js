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

  /* =====================================================
     1️⃣ SAVE SALE TO DATABASE
  ===================================================== */

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

          /* =====================================================
             2️⃣ GENERATE RECEIPT PDF
          ===================================================== */

          const receiptPath = path.join(
            process.cwd(),
            `receipt-${Date.now()}.pdf`
          );

          const doc = new PDFDocument({
            size: "A4",
            margin: 40,
          });

          const stream = fs.createWriteStream(receiptPath);
          doc.pipe(stream);

          // Header
          doc
            .fontSize(18)
            .text("Sora’s Bakery", { align: "center" })
            .moveDown(0.5);

          doc
            .fontSize(10)
            .text(new Date().toLocaleString(), { align: "center" })
            .moveDown();

          doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown();

          // Items
          doc.fontSize(12);
          items.forEach((item) => {
            doc.text(
              `${item.name}   x${item.quantity}   ৳${
                item.price * item.quantity
              }`
            );
          });

          doc.moveDown();
          doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown();

          // Total
          doc
            .fontSize(14)
            .text(`TOTAL: ৳${total}`, { align: "right" })
            .moveDown();

          doc
            .fontSize(12)
            .text("Thank you for your purchase!", { align: "center" });

          doc.end();

          stream.on("finish", () => {
            /* =====================================================
               3️⃣ PRINT PDF USING SUMATRAPDF
            ===================================================== */

            const printerName = "Pantum-6F0F47 (M6550NW series)";
            const sumatraPath = `"C:\\Users\\X1 CARBON\\AppData\\Local\\SumatraPDF\\SumatraPDF.exe"`;

            const command = `${sumatraPath} -print-to "${printerName}" -silent "${receiptPath}"`;

            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error("❌ Print error:", error);
                console.error(stderr);
                return res.status(500).json({ error: "Print failed" });
              }

              console.log("🖨️ PDF printed & sale saved successfully");
              res.json({
                message: "Printed & sale recorded",
              });
            });
          });
        }
      );
    }
  );
});

export default router;
