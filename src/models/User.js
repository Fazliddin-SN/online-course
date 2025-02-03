import { Schema, model } from "mongoose";
import { number } from "zod";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["manager", "admin", "user"],
      default: "user",
    },

    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
