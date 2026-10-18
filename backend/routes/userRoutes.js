import express from "express";

import {
  register,
  login,
 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// router.get("/:id", getUserById);

// router.patch("/:id", updateUser);

// router.delete("/:id", deleteUser);

export default router;