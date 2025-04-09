import express from "express";
import dotenv from "dotenv";
import connect from "./connect.js";
const app = express();

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;

connect(MONGODB_URL);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
``;
