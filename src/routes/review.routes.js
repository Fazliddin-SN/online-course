import { Router } from "express";
import { reviewControllers } from "../controllers/review.controller.js";
// check validations
import { validateData, verifyToken } from "../middlewares/index.js";
// validate review schema
import { reviewValidationSchema } from "../validation/schemaValidation.js";

export const reviewRouter = Router();

reviewRouter.post(
  "/reviews",
  verifyToken,
  validateData(reviewValidationSchema),
  reviewControllers.create
);
