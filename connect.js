import mongoose from "mongoose";

export default async function connect(MONGODB_URL) {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("connected to db");
  } catch (error) {
    console.log("error connection to mongodb" + error);
  }
}
