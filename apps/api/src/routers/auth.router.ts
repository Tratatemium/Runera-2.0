import express from "express";

import validation from "../middleware/validation/auth.validation.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authController from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validation.validateRegisterRequest,
  authController.createUser,
);

authRouter.post(
  "/login",
  validation.validateLoginRequest,
  authController.loginUser,
);

authRouter.post("/logout", authController.logout);

authRouter.post(
  "/logoutAll",
  authMiddleware.checkAuth,
  authController.logoutAll,
);

export default authRouter;

// IDEA: POST /auth/password-reset
// {
//   "email": "user@example.com"
// }

// IDEA: POST /auth/password-reset/confirm
// {
//   "token": "reset_token",
//   "newPassword": "new_password"
// }
