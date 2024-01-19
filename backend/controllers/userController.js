import { UserModel } from "../models/User";

import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUserController = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if (!email || !username || !password) {
      res.status(400);
      throw new Error("Please don't skip any fields");
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      res.status(400);
      throw new Error(
        `User with ${
          existingUser.username === username ? "username" : "email"
        } already exists`
      );
    }

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      response: {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
        accessToken: generateToken(newUser._id),
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e.message,
    });
  }
});
