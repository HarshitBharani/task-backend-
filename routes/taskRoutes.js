import { Router } from "express";
import { userModel } from "../models/userModel.js";

const taskRouter = Router();
taskRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.body;
    const tasks = await userModel.findById(userId, { tasks: 1, _id: 0 });
    res.status(200).json(tasks);
  } catch (e) {}
});
taskRouter.post("/create", async (req, res) => {
  try {
    const { task, userId } = req.body;
    if (!task?.title || !task?.status) {
      return res
        .status(400)
        .json({ message: "title and status are req for tasks" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: { tasks: task },
      },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ message: "task added succesfully", tasks: updatedUser?.tasks });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "something went wrong" });
  }
});
taskRouter.delete("/", async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { tasks: { _id: taskId } },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Task deleted succesfully", tasks: updatedUser?.tasks });
  } catch (e) {
    console.error(e);
  }
});
taskRouter.put("/", async (req, res) => {
  try {
    const { userId, taskId, updateTask } = req.body;
    const setUpdates = {};
    for (const key in updateTask) {
      setUpdates[`tasks.$.${key}`] = updateTask[key];
    }
    console.log({ userId, taskId, setUpdates });
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId, "tasks._id": taskId },
      { $set: setUpdates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "task updated successfully",
      tasks: updatedUser.tasks,
    });
  } catch (e) {
    console.error(e);
    res.send(500).json({ message: "something went wrong " });
  }
});
export default taskRouter;
