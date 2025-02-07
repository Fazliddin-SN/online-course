import { Router } from "express";
import { coachesController } from "../controllers/index.js";
import { validateData } from "../middlewares/validationMiddleware.js";
import {
  coachesSchemaValidation,
  userLoginSchema,
} from "../validation/schemaValidation.js";
import { authorizeRole, verifyToken } from "../middlewares/index.js";
export const CoachesRouter = Router();

// REGISTER NEW COACH
CoachesRouter.post(
  "/coaches/register",
  validateData(coachesSchemaValidation),
  coachesController.registerCoach
);
// COACH LOGIN
CoachesRouter.post(
  "/coaches/login",
  validateData(userLoginSchema),
  coachesController.login
);
