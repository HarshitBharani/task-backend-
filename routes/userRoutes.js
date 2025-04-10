import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt, { genSalt } from "bcrypt";
import { userModel } from "../models/userModel.js";
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req?.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const emailSchema = z
      .string()
      .email({ message: "please enter a valid email " });
    const isValid = emailSchema.safeParse(email);
    if (!isValid?.success) {
      return res.status(400).json({ message: isValid?.error?.issues });
    }
    const existingUser = await userModel.findOne({ email }, { email: 1 });
    if (existingUser) {
      return res.status(409).json({ message: "user already exsist" });
    }
    const salt = await genSalt(12);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      email,
      password: encryptedPassword,
      tasks: [],
    });
    const token = jwt.sign({ user: user?._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "user created successfully",
      token: token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "something went wrong" });
  }
});

export default userRouter;
