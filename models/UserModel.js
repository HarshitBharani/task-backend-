import { model, Schema } from "mongoose";

const userSchema = new Schema({
  password: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  tasks: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: {
          values: ["pending", "in-progress", "completed"],
          message: "enum failed for status invalid value passed",
        },
        required: true,
      },
    },
  ],
});

export const userModel = model("user", userSchema);
