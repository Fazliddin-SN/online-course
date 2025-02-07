import { Router } from "express";
import {
  authorizeRole,
  validateData,
  verifyToken,
} from "../middlewares/index.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validation/schemaValidation.js";
import { authControllers } from "../controllers/index.js";

export const authRouter = Router();

authRouter.post(
  "/users/register",
  validateData(userRegisterSchema),
  authControllers.register
);

//USER LOGIN
authRouter.post(
  "/users/login",
  validateData(userLoginSchema),
  authControllers.login
);

// ACCESS PROFILE BY PASSWORD AND EMAIL query params
authRouter.get("/users/profile", verifyToken, authControllers.profile);

// DELETE USER BY ID
authRouter.delete(
  "/users/delete/:userId",
  verifyToken,
  authorizeRole("admin"),
  authControllers.delete
);

// GET USER INFO BY ID
authRouter.get(
  "/users/userInfo/:userId",
  verifyToken,
  authorizeRole("admin"),
  authControllers.findUser
);

// UPDATE USER INFO
authRouter.put(
  "/users/update/:userId",
  verifyToken,
  authorizeRole("admin"),
  authControllers.updateUser
);

authRouter.get(
  "/users/details",
  verifyToken,
  authorizeRole("admin"),
  authControllers.fetchAllUsers
);
