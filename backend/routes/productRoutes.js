import express from "express";
import { 
    getProducts ,
    getProductById,
    createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug
} from "../controllers/productController.js";


const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.get("/slug/:slug", getProductBySlug);

export default router;