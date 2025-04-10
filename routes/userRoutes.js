import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt, { genSalt } from "bcrypt";
import { userModel } from "../models/UserModel.js";
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req?.body;
    console.log(password);
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
    const salt = await genSalt(10);
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
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res(400).json({ message: "email and password are required" });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: " user logged in succesfully",
      token: token,
      tasks: user.tasks,
    });
  } catch (error) {
    console.error("login error", error);
    res.status(500).json({ message: "something went wrong" });
  }
});

export default userRouter;
