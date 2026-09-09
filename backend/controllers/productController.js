import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch product"
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category_id
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products
        (name, description, price, stock, category_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name,
        description,
        price,
        stock,
        category_id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create product"
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      stock,
      category_id
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET
         name = $1,
         description = $2,
         price = $3,
         stock = $4,
         category_id = $5
       WHERE id = $6
       RETURNING *`,
      [
        name,
        description,
        price,
        stock,
        category_id,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update product"
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete product"
    });
  }
};