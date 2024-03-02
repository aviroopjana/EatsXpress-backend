import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import { errorHandler } from "../../utils/error";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

type UserRequestBody = {
  username: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  profilePicture: string;
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, name, phoneNumber }: UserRequestBody =
    req.body;

  if (
    !username ||
    !email ||
    !password ||
    !name ||
    !phoneNumber ||
    username === "" ||
    email === "" ||
    password === "" ||
    name === "" ||
    phoneNumber === ""
  ) {
    return next(errorHandler(res, 400, "All fields are required!"));
  }

  const hashedPassword = bcryptjs.hashSync("password", 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    name,
    phoneNumber,
  });

  try {
    await newUser.save();
    res.status(201).json("New user saved to database");
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password }: UserRequestBody = req.body;

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(res, 401, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ username });

    if (!validUser) {
      return next(errorHandler(res, 404, "User not found"));
    }

    const token = jwt.sign(
      {
        username: validUser.username,
        password: validUser.password,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser.toJSON();

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
