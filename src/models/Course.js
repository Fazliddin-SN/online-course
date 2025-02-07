import mongoose, { Schema, model } from "mongoose";
const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    coaches: [
      { type: mongoose.Types.ObjectId, ref: "Coach", role: "main" },
      {
        typeof: mongoose.Types.ObjectId,
        ref: "Coach",
        role: "second",
      },
    ],

    description: {
      type: String,
      required: true,
    },
    agelimit: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reviews: {
      type: Array,
      required: false,
    },
    rate: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export const Course = model("Course", courseSchema);
