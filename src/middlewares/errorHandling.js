import { appError } from "../utils/customError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof appError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }
  // For unhandled errors, send a generic response

  console.log("Unexpected Error: ", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
