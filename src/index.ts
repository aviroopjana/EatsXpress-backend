import cors from "cors";
import express, { Application, Express, Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import dotenv from 'dotenv';

const app: Application = express();

dotenv.config();

const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server started");
});

app.get("/api/test", (req, res) => {
  res.send("Test Server running successfully");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB Database");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
