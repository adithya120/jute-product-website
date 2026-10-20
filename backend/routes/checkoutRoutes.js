
import express from "express";
import { getCheckout } from "../controllers/checkoutController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCheckout);

export default router;
