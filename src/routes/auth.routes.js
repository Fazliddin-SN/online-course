import { Router } from "express";
import {
  authorizeRole,
  validateData,
  verifyToken,
} from "../middlewares/index.js";
import { userRegisterSchema } from "../validation/schemaValidation.js";
import { authControllers } from "../controllers/index.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateData(userRegisterSchema),
  authControllers.register
);

authRouter.post("/login", authControllers.login);
authRouter.get("/profile", authControllers.profile);
authRouter.delete(
  "/delete/:userId",
  verifyToken,
  authorizeRole("admin"),
  authControllers.delete
);
authRouter.get(
  "/users/:userId",
  verifyToken,
  authorizeRole("admin"),
  authControllers.findUser
);
