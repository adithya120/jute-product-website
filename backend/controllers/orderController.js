import pool from "../config/db.js";
import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  let dbOrderId;

  try {
    const userId = req.user.id;

    await client.query("BEGIN");

    // Get the customer's cart and actual variant prices.
    const cartResult = await client.query(
      `SELECT
          ci.id AS cart_item_id,
          ci.quantity,
          v.id AS variant_id,
          v.product_id,
          v.price,
          v.discount_price,
          v.stock
       FROM carts c
       JOIN cart_items ci ON ci.cart_id = c.id
       JOIN product_variants v ON v.id = ci.variant_id
       WHERE c.user_id = $1
       ORDER BY ci.id
       FOR UPDATE OF ci, v`,
      [userId]
    );

    const items = cartResult.rows;

    if (items.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let totalPaise = 0;

    for (const item of items) {
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        Number(item.stock) < item.quantity
      ) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "Invalid quantity or insufficient stock",
          variant_id: item.variant_id,
        });
      }

      const unitPrice = Number(
        item.discount_price ?? item.price
      );

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error("Invalid variant price");
      }

      item.unitPricePaise = Math.round(unitPrice * 100);
      totalPaise += item.unitPricePaise * item.quantity;
    }

    if (totalPaise <= 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // Create the database order.
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES ($1, $2, $3)
       RETURNING id, total_amount, status`,
      [userId, (totalPaise / 100).toFixed(2), "pending"]
    );

    const order = orderResult.rows[0];
    dbOrderId = order.id;

    // Save each item with its selected variant and price snapshot.
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, variant_id, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          dbOrderId,
          item.product_id,
          item.variant_id,
          item.quantity,
          (item.unitPricePaise / 100).toFixed(2),
        ]
      );
    }

    await client.query("COMMIT");

    // Create the Razorpay order. Amount is in paise.
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `order_${dbOrderId}`,
      notes: {
        database_order_id: String(dbOrderId),
        user_id: String(userId),
      },
    });

    // Save the payment attempt.
    await pool.query(
      `INSERT INTO payments
         (order_id, provider, razorpay_order_id, amount, currency, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dbOrderId,
        "razorpay",
        razorpayOrder.id,
        (totalPaise / 100).toFixed(2),
        "INR",
        "pending",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Order created",
      order_id: dbOrderId,
      total_amount: order.total_amount,
      razorpay_order_id: razorpayOrder.id,
      razorpay_key_id: process.env.RAZORPAY_KEY_ID,
      currency: "INR",
    });
  } catch (error) {
    console.error("Create order error:", error);

    // The DB transaction may already have been committed.
    if (dbOrderId) {
      await pool.query(
        `UPDATE orders
         SET status = 'payment_pending'
         WHERE id = $1 AND status = 'pending'`,
        [dbOrderId]
      ).catch(console.error);
    }

    // if (!clientReleased) {
    //   // Connection cleanup is handled in finally below.
    //    client.release();
    // }

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  } finally {
    client.release();
  }
};