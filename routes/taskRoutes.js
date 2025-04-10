import { Router } from "express";
import { userModel } from "../models/userModel.js";

const taskRouter = Router();

taskRouter.post("/create", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task?.title || !task?.status) {
      return res
        .status(400)
        .json({ message: "title and status are req for tasks" });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      {
        $push: { tasks: task },
      },
      { new: true, runValidators: true }
    );
    res.send({ updatedUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "something went wrong" });
  }
});
export default taskRouter;
