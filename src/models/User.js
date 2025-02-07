import mongoose, { Schema, model } from "mongoose";

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
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["manager", "admin", "user"],
      default: "user",
    },
    level: {
      type: String,
      required: true,
      default: "beginner",
    },
    enrollments: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
