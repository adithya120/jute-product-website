import express from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/",getCategories);
router.get("/:id",getCategoryById);
router.post("/",createCategory);
router.patch("/:id",updateCategory);
router.delete("/:id",deleteCategory);

export default router;