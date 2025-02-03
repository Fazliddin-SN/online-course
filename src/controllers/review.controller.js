import mongoose from "mongoose";
import { appError } from "../utils/customError.js";
import { User, Course, Review } from "../models/index.js";

export const reviewControllers = {
  async create(req, res, next) {
    try {
      const { courseId, reviewerId, comment, rate } = req.body;
      // make sure ids are valid
      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(reviewerId)
      ) {
        throw new appError("Course id or user id is invalid!", 400);
      }

      //create a new review
      const newReview = new Review({
        courseId: courseId,
        reviewerId: reviewerId,
        comment: comment,
        rate: rate,
      });

      newReview.save().then((response) => {
        console.log("Review is added");
        console.log("Review: ", response);
      });

      // extract information to add course model
      let reviews = {
        reviewer: newReview.reviewerId,
        commet: newReview.comment,
        givenRate: newReview.rate,
      };

      //create a review part for course model
      const courseReview = await Course.findByIdAndUpdate(
        courseId,
        { $push: { reviews: reviews } },
        { new: true }
      );

      if (!courseReview) {
        throw new appError("Cannot find and update course", 400);
      }
      // accumulate overall rates
      let courseInfo = await Course.findById(courseId);
      let rates = 0;
      courseInfo.reviews.map((item) => {
        rates += item.givenRate;
      });
      // accumulate over all reviewers
      let reviewers = 0;
      courseInfo.reviews.forEach((item) => reviewers++);
      console.log("reviewers: ", reviewers);
      // final rate
      const finalRate = rates / reviewers;

      // push new property to Course Model
      const courseRate = await Course.findByIdAndUpdate(
        courseId,
        {
          $set: { rate: finalRate.toFixed(1) },
        },
        { new: true }
      );

      if (!courseRate) {
        throw new Error("Cannot find and add new property to the course!", 404);
      }

      res.status(201).json({
        message: "Review is added!",
        request: {
          type: "POST",
          url: "http://localhost:7009/api/auth/reviews",
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
