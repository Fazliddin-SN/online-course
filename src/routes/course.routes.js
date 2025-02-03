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
  courseControllers.creare
);

courseRouter.patch("/courses/update", courseControllers.updateCourse);
courseRouter.delete("/courses/remove", courseControllers.delete);
courseRouter.put("/courses/assign", courseControllers.assignStudents);
