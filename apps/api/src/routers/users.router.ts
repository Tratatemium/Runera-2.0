import express from "express";

import * as usersValidation from "../middleware/validation/users.validation.js";
import * as runsValidation from "../middleware/validation/runs.validation.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
import * as guardMiddleware from "../middleware/guard.middleware.js";
import * as usersController from "../controllers/users.controller.js";
import * as runsController from "../controllers/runs.controller.js";

const usersRouter = express.Router();

// NOTE: possibly add guard middleware to check if user is active / banned / etc.

/* ================================================================================================= */
/*  User (me)                                                                                        */
/* ================================================================================================= */

usersRouter.get("/me", authMiddleware.checkAuth, usersController.getMe);

usersRouter.patch(
  "/me/profile",
  usersValidation.validateProfileUpdate,
  authMiddleware.checkAuth,
  usersController.updateProfile,
);

usersRouter.patch(
  "/me/account",
  usersValidation.validateAccountUpdate,
  authMiddleware.checkAuth,
  usersController.updateAccount,
);

/* ================================================================================================= */
/*  My runs                                                                                          */
/* ================================================================================================= */

usersRouter.post(
  "/me/runs",
  runsValidation.validateRun({ mode: "require_all" }),
  authMiddleware.checkAuth,
  runsController.postNewRun,
);

usersRouter.get("/me/runs", authMiddleware.checkAuth, runsController.getMyRuns);

/* ================================================================================================= */
/*  Admin                                                                                            */
/* ================================================================================================= */

usersRouter.get(
  "/",
  authMiddleware.checkAuth,
  guardMiddleware.checkPermissions({ mode: "admin", type: "userId" }),
  usersController.getAllUsers,
);

usersRouter.get(
  "/:id",
  usersValidation.validateUUID("id"),
  authMiddleware.checkAuth,
  guardMiddleware.checkPermissions({
    mode: "either",
    param: "id",
    type: "userId",
  }),
  usersController.getUserById,
);

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

export default usersRouter;
