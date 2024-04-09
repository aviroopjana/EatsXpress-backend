import express from "express";
import { verifyToken } from "../middlewares/verifyUser";
import { createCheckoutSession } from "../controllers/order.controller";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  verifyToken,
  createCheckoutSession
);

export default router;