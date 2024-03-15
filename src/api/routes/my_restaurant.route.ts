import express from "express";
import { createRestaurant } from "../controllers/my_restaurant.controller";
import { verifyToken } from "../middlewares/verifyUser";
import { authorizeRestaurantCreation } from "../middlewares/authorizeRestaurant";

const router = express.Router();

router.post(
  "/createRestaurant",
  verifyToken,
  authorizeRestaurantCreation,
  createRestaurant
);

export default router;
