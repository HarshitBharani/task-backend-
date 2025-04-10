import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./connect.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
const app = express();

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;
app.use(cors());
connect(MONGODB_URL);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/user", userRouter);
app.use("/task", authMiddleware, taskRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
