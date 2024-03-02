import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';
import { errorHandler } from '../../utils/error';
import bcryptjs from 'bcryptjs';

type UserRequestBody = {
    username: string;
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    profilePicture: string;
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const {
    username,
    email,
    password,
    name,
    phoneNumber
  }: UserRequestBody = req.body;

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

  const hashedPassword = bcryptjs.hashSync('password', 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    name,
    phoneNumber,
  });

  try {
    await newUser.save();
    res.status(201).json('New user saved to database');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  // Implement signin logic here
  try {
    // To Do signin logic
  } catch (error) {
    next(error);
  }
};
