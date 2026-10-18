import pool from "../config/db.js";


// GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
          c.id AS cart_id,
          ci.id AS cart_item_id,
          ci.variant_id,
          ci.quantity,

          p.id AS product_id,
          p.name AS product_name,
          p.slug,

          pv.sku,
          pv.color,
          pv.size,
          pv.price,
          pv.discount_price,
          pv.stock,

          pi.image_url

      FROM carts c

      JOIN cart_items ci
          ON c.id = ci.cart_id

      JOIN product_variants pv
          ON ci.variant_id = pv.id

      JOIN products p
          ON pv.product_id = p.id

      LEFT JOIN product_images pi
          ON pv.id = pi.variant_id
          AND pi.is_primary = true

      WHERE c.user_id = $1

      ORDER BY ci.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      cart: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { variant_id, quantity = 1 } = req.body;

    if (!variant_id) {
      return res.status(400).json({
        success: false,
        message: "variant_id is required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Check variant
    const variantResult = await pool.query(
      `
      SELECT id, stock, status
      FROM product_variants
      WHERE id = $1
      `,
      [variant_id]
    );

    if (variantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    const variant = variantResult.rows[0];

    if (variant.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This product variant is not available",
      });
    }

    if (quantity > variant.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity is greater than available stock",
      });
    }

    // Find user's cart
    let cartResult = await pool.query(
      `
      SELECT id
      FROM carts
      WHERE user_id = $1
      `,
      [userId]
    );

    let cartId;

    // Create cart if user doesn't have one
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        `
        INSERT INTO carts (user_id)
        VALUES ($1)
        RETURNING id
        `,
        [userId]
      );

      cartId = newCart.rows[0].id;

    } else {
      cartId = cartResult.rows[0].id;
    }

    // Check if variant already exists in cart
    const existingItem = await pool.query(
      `
      SELECT id, quantity
      FROM cart_items
      WHERE cart_id = $1
      AND variant_id = $2
      `,
      [cartId, variant_id]
    );

    if (existingItem.rows.length > 0) {
      const currentQuantity = existingItem.rows[0].quantity;
      const newQuantity = currentQuantity + quantity;

      if (newQuantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      const updatedItem = await pool.query(
        `
        UPDATE cart_items
        SET
          quantity = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [newQuantity, existingItem.rows[0].id]
      );

      return res.status(200).json({
        success: true,
        message: "Cart quantity updated",
        item: updatedItem.rows[0],
      });
    }

    // Add new item
    const result = await pool.query(
      `
      INSERT INTO cart_items
          (cart_id, variant_id, quantity)
      VALUES
          ($1, $2, $3)
      RETURNING *
      `,
      [cartId, variant_id, quantity]
    );

    await pool.query(
      `
      UPDATE carts
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [cartId]
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      item: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const result = await pool.query(
      `
      SELECT
          ci.id,
          ci.cart_id,
          ci.variant_id,
          pv.stock

      FROM cart_items ci

      JOIN carts c
          ON ci.cart_id = c.id

      JOIN product_variants pv
          ON ci.variant_id = pv.id

      WHERE ci.id = $1
      AND c.user_id = $2
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const item = result.rows[0];

    if (quantity > item.stock) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }

    const updatedItem = await pool.query(
      `
      UPDATE cart_items
      SET
          quantity = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [quantity, id]
    );

    await pool.query(
      `
      UPDATE carts
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [item.cart_id]
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      item: updatedItem.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM cart_items ci
      USING carts c
      WHERE ci.id = $1
      AND ci.cart_id = c.id
      AND c.user_id = $2
      RETURNING ci.*
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      item: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM cart_items ci
      USING carts c
      WHERE ci.cart_id = c.id
      AND c.user_id = $1
      RETURNING ci.id
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      deleted_items: result.rowCount,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};