import { Schema, model } from "mongoose";
import { string } from "zod";

const coachesSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    expertise: {
      type: String,
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
      required: false,
      default: "coach",
    },
    levelFor: {
      type: String,
      required: true,
      default: "beginner",
    },
    testingProcess: {
      type: String,
      required: false,
      default: "Not accepted",
    },
    mainCoach: {
      type: String,
      required: false,
      default: "second teacher",
    },
    hasCourse: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  {
    timestamps: true,
  }
);

export const Coach = model("Coach", coachesSchema);
