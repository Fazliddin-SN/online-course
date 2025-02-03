import jwt from "jsonwebtoken";
import { appError } from "../utils/customError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("authHeader: ", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided!" });
    }
    // extract token after "Bearer "
    const token = authHeader.split(" ")[1];
    console.log("token: ", token);
    // make sure token exists
    if (!token) {
      throw new appError("No token, authorization denied.", 401);
    }

    const secret = process.env.JWT_SECRET;
    // console.log("secret: ", secret);

    jwt.verify(token, secret, (err, decoded) => {
      // check error
      if (err) {
        throw new appError("Unauthorized: Invalid token!", 401);
      }
      // console.log("Decoded Token : ", decoded);

      req.user = decoded; // Attach user data to request

      next();
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token!" });
    next(error);
  }
};
