import { Schema, model } from "mongoose";
import { number } from "zod";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      // unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    agelimit: {
      type: Number,
      required: true,
    },
    subject: {
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
    students: {
      type: Array,
      required: false,
    },
    reviews: {
      type: Object,
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
