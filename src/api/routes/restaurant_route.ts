import express from "express";
import { param } from "express-validator";
import { getRestaurant, searchRestaurant } from "../controllers/restaurant.controller";

const router = express.Router();

router.get(
  "/search/:location",
  param("location")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Location paramenter must be a valid string"),
    searchRestaurant
);

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId paramenter must be a valid string"),
  getRestaurant
);

export default router;