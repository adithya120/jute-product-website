import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js"
import productRoutes from "./routes/productRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Ecommerce API is running"
    });
});





app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");

    res.json({
      message: "Database connected",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});