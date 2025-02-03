import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: {
      type: String,
      required: false,
    },
    rate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Review = model("Review", reviewSchema);
