import { Router } from "express";
import { courseControllers } from "../controllers/course.controller.js";
import { validateData } from "../middlewares/validationMiddleware.js";
import { courseValidation } from "../validation/schemaValidation.js";
import { authorizeRole, verifyToken } from "../middlewares/index.js";
export const courseRouter = Router();

courseRouter.post(
  "/courses",
  verifyToken,
  authorizeRole("admin"),
  validateData(courseValidation),
  courseControllers.create
);

courseRouter.put(
  "/courses/update/:courseId",
  verifyToken,
  authorizeRole("admin", "coach"),
  validateData(courseValidation),
  courseControllers.updateCourse
);

courseRouter.delete(
  "/courses/remove/:courseId",
  verifyToken,
  authorizeRole("admin"),
  courseControllers.delete
);
courseRouter.put(
  "/courses/assign",
  verifyToken,
  authorizeRole("admin"),
  courseControllers.assignStudents
);
// COACH ASSIGN
courseRouter.put(
  "/courses/coaches/assign",
  verifyToken,
  authorizeRole("admin"),
  courseControllers.assignCoaches
);
courseRouter.get(
  "/courses/details",
  verifyToken,
  courseControllers.fetchAllCourse
);

courseRouter.get(
  "/courses/description",
  verifyToken,
  courseControllers.getDescription
);
