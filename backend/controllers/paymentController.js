import crypto from "node:crypto";
import pool from "../config/db.js";

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  try {
    const userId = req.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    const paymentResult = await pool.query(
      `SELECT
          p.id AS payment_id,
          p.order_id,
          p.amount,
          p.currency,
          p.status AS payment_status,
          o.user_id,
          o.status AS order_status
       FROM payments p
       JOIN orders o ON o.id = p.order_id
       WHERE p.razorpay_order_id = $1
         AND o.user_id = $2`,
      [razorpay_order_id, userId]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const payment = paymentResult.rows[0];

    // Repeated verification should not create another state change.
    if (payment.payment_status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order_id: payment.order_id,
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Lock the payment row to avoid duplicate concurrent updates.
      const lockedResult = await client.query(
        `SELECT status, order_id
         FROM payments
         WHERE id = $1
         FOR UPDATE`,
        [payment.payment_id]
      );

      if (lockedResult.rows[0].status === "paid") {
        await client.query("COMMIT");
        return res.status(200).json({
          success: true,
          message: "Payment already verified",
          order_id: payment.order_id,
        });
      }

      await client.query(
        `UPDATE payments
         SET razorpay_payment_id = $1,
             status = 'paid'
         WHERE id = $2`,
        [razorpay_payment_id, payment.payment_id]
      );

      await client.query(
        `UPDATE orders
         SET status = 'confirmed'
         WHERE id = $1`,
        [payment.order_id]
      );

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order_id: payment.order_id,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};