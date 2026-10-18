import express from "express";
import upload from "../middleware/upload.js";
import {
  addProductImages,
} from "../controllers/productImageController.js";

const router = express.Router();

// Add JWT and admin-role middleware before upload.
router.post(
  "/:productId/variants/:variantId/images",
  upload.array("images", 5),
  addProductImages
);

export default router;