import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { courseRouter } from "./course.routes.js";
import { reviewRouter } from "./review.routes.js";
import { CoachesRouter } from "./coaches.routes.js";
export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/auth", courseRouter);
apiRouter.use("/auth", reviewRouter);
apiRouter.use("/auth", CoachesRouter);
