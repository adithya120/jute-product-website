import pool from "../config/db.js";

// export const getProducts = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM products ORDER BY id ASC"
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Failed to fetch products"
//     });
//   }
// };

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.brand,
        p.status,

        c.id AS category_id,
        c.name AS category_name,

        MIN(v.price) AS price,
        MIN(v.discount_price) AS discount_price,

        (
          SELECT pi.media_url
          FROM product_images pi
          WHERE pi.product_id = p.id
            AND pi.is_primary = true
          LIMIT 1
        ) AS image

      FROM products p

      LEFT JOIN categories c
        ON p.category_id = c.id

      LEFT JOIN product_variants v
        ON p.id = v.product_id

      GROUP BY
        p.id,
        c.id,
        c.name

      ORDER BY p.id DESC
    `);

    res.status(200).json({
      success: true,
      products: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
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

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("slugggggggggggggggggggg",slug);

    // 1. Get product
    const productResult = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.brand,
        p.status,

        c.id AS category_id,
        c.name AS category_name

      FROM products p

      LEFT JOIN categories c
        ON p.category_id = c.id

      WHERE p.slug = $1
      `,
      [slug]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = productResult.rows[0];

    // 2. Get variants
    const variantsResult = await pool.query(
      `
      SELECT
        id,
        sku,
        color,
        size,
        price,
        discount_price,
        stock,
        status

      FROM product_variants

      WHERE product_id = $1
        AND status = 'active'

      ORDER BY id ASC
      `,
      [product.id]
    );

    // 3. Get images
    const imagesResult = await pool.query(
      `
      SELECT
        id,
        media_url,
        alt_text,
        is_primary,
        display_order

      FROM product_images

      WHERE product_id = $1

      ORDER BY display_order ASC
      `,
      [product.id]
    );

    // 4. Build frontend response
    const response = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
      status: product.status,

      category: {
        id: product.category_id,
        name: product.category_name
      },

      images: imagesResult.rows.map((image) => ({
        id: image.id,
        url: image.media_url,
        alt: image.alt_text,
        isPrimary: image.is_primary,
        displayOrder: image.display_order
      })),

      variants: variantsResult.rows.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        price: variant.price,
        discountPrice: variant.discount_price,
        stock: variant.stock,
        status: variant.status
      }))
    };

    res.status(200).json({
      success: true,
      product: response
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
};