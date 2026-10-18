import pool from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const addProductImages = async (req, res) => {
  const { productId, variantId } = req.params;
  const files = req.files || [];

  if (!files.length) {
    return res.status(400).json({
      message: "Please select at least one image",
    });
  }

  const uploadedAssets = [];
  let client;

  try {
    client = await pool.connect();

    const productResult = await client.query(
      "SELECT id FROM products WHERE id = $1",
      [productId]
    );

    if (!productResult.rows.length) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const variantResult = await client.query(
      `SELECT id
       FROM product_variants
       WHERE id = $1 AND product_id = $2`,
      [variantId, productId]
    );

    if (!variantResult.rows.length) {
      return res.status(404).json({
        message: "Variant not found for this product",
      });
    }

    let primaryIndex = null;

    if (req.body.primaryIndex !== undefined) {
      primaryIndex = Number(req.body.primaryIndex);

      if (
        !Number.isInteger(primaryIndex) ||
        primaryIndex < 0 ||
        primaryIndex >= files.length
      ) {
        return res.status(400).json({
          message: "Invalid primaryIndex",
        });
      }
    }

    await client.query("BEGIN");

    // Lock the variant while changing its gallery.
    await client.query(
      `SELECT id
       FROM product_variants
       WHERE id = $1 AND product_id = $2
       FOR UPDATE`,
      [variantId, productId]
    );

    const orderResult = await client.query(
      `SELECT COALESCE(MAX(display_order), 0) AS max_order
       FROM product_images
       WHERE product_id = $1 AND variant_id = $2`,
      [productId, variantId]
    );

    let nextOrder =
      Number(orderResult.rows[0].max_order) + 1;

    const primaryResult = await client.query(
      `SELECT id
       FROM product_images
       WHERE product_id = $1
         AND variant_id = $2
         AND is_primary = TRUE`,
      [productId, variantId]
    );

    const hasPrimary = primaryResult.rows.length > 0;

    if (primaryIndex !== null) {
      await client.query(
        `UPDATE product_images
         SET is_primary = FALSE
         WHERE product_id = $1 AND variant_id = $2`,
        [productId, variantId]
      );
    }

    const savedImages = [];

    for (let i = 0; i < files.length; i++) {
      const uploaded = await uploadToCloudinary(
        files[i].buffer
      );

      uploadedAssets.push(uploaded.public_id);

      const isPrimary =
        primaryIndex !== null
          ? i === primaryIndex
          : !hasPrimary && i === 0;

      const altText =
        Array.isArray(req.body.alt_texts)
          ? req.body.alt_texts[i] || files[i].originalname
          : req.body.alt_text || files[i].originalname;

      const result = await client.query(
        `INSERT INTO product_images (
          product_id,
          variant_id,
          media_url,
          public_id,
          alt_text,
          is_primary,
          display_order,
          media_type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          productId,
          variantId,
          uploaded.media_url,
          uploaded.public_id,
          altText,
          isPrimary,
          nextOrder++,
          "image",
        ]
      );

      savedImages.push(result.rows[0]);
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Product images uploaded successfully",
      images: savedImages,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    await Promise.allSettled(
      uploadedAssets.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      )
    );

    console.error("Product image upload error:", error);

    return res.status(500).json({
      message: "Failed to upload product images",
    });
  } finally {
    if (client) client.release();
  }
};
