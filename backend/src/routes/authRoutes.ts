import express from "express";
import {
  loginController,
  verifyTokenController,
} from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", loginController);
router.get("/verify", authMiddleware, verifyTokenController);

export default router;
