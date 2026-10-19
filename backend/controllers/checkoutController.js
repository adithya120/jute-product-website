
import pool from "../config/db.js";

export const getCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get customer profile and default address
    const customerResult = await pool.query(
      `SELECT
          u.id AS user_id,
          u.name AS account_name,
          u.email,
          a.id AS address_id,
          COALESCE(a.full_name, u.name) AS full_name,
          a.phone,
          a.address_line1,
          a.address_line2,
          a.city,
          a.state,
          a.postal_code,
          a.country,
          a.is_default
       FROM users u
       LEFT JOIN customer_addresses a
         ON a.user_id = u.id
        AND a.is_default = TRUE
       WHERE u.id = $1`,
      [userId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const customer = customerResult.rows[0];

    // 2. Return customer information
    return res.status(200).json({
      message: "Checkout information fetched successfully",
      customer: {
        user_id: customer.user_id,
        name: customer.full_name,
        email: customer.email,
        phone: customer.phone
      },
      shipping_address: customer.address_id
        ? {
            address_id: customer.address_id,
            address_line1: customer.address_line1,
            address_line2: customer.address_line2,
            city: customer.city,
            state: customer.state,
            postal_code: customer.postal_code,
            country: customer.country,
            is_default: customer.is_default
          }
        : null
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return res.status(500).json({
      message: "Failed to fetch checkout information"
    });
  }
};
