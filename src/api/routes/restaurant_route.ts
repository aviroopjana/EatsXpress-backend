import express from "express";
import { param } from "express-validator";
import { searchRestaurant } from "../controllers/restaurant.controller";

const router = express.Router();

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City paramenter must be a valid string"),
    searchRestaurant
);
