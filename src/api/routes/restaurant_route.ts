import express from "express";
import { param } from "express-validator";
import { searchRestaurant } from "../controllers/restaurant.controller";

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

export default router;