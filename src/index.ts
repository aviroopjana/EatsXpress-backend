import cors from "cors";
import express, { Application, Request, Response } from "express";
import mongoose, { Error } from "mongoose";
import dotenv from "dotenv";
import authRoute from "./api/routes/auth.route";
import userRoute from "./api/routes/user.route";
import myRestaurantRoute from "./api/routes/my_restaurant.route";
import restaurantRoute from "./api/routes/restaurant_route";
import cookieParser from 'cookie-parser';

const app: Application = express();

dotenv.config();

const port = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Server started');
});

app.get("/api/test", (req, res) => {
  res.send("Test Server running successfully");
});

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING as string)
  .then(() => {
    console.log("Connected to MongoDB Database");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/my_restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);

app.use((err: Error, req, res, next) => {
  const statusCode: number = 500;
  const message: string = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
});


