import express from "express";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "../controllers/my_restaurant.controller";
import { verifyToken } from "../middlewares/verifyUser";
import { authorizeRestaurant } from "../middlewares/authorizeRestaurant";

const router = express.Router();

router.post(
  "/createRestaurant",
  verifyToken,
  authorizeRestaurant,
  createRestaurant
);

router.put(
  "/updateRestaurant/:restaurantId",
  verifyToken,
  authorizeRestaurant,
  updateRestaurant
);

router.get(
  "/getRestaurant",
  verifyToken,
  authorizeRestaurant,
  getRestaurant
);

export default router;
