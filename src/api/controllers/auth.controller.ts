import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import { errorHandler } from "../../utils/error";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

type UserRequestBody = {
  name: string;
  username: string;
  email: string;
  password: string;
  accountType: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, name, accountType, phone, address, city, pincode }: UserRequestBody =
    req.body;

  if (
    !username ||
    !email ||
    !password ||
    !name ||
    !phone ||
    username === "" ||
    email === "" ||
    password === "" ||
    name === "" ||
    phone === ""
  ) {
    return next(errorHandler(res, 400, "All fields are required!"));
  }

  const hashedPassword = bcryptjs.hashSync("password", 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    name,
    phone,
    accountType,
    address,
    city,
    pincode
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

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(res, 400, "Password is incorrect"))
    };

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
