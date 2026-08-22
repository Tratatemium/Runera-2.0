import express from "express";

import * as runsValidation from "../middleware/validation/runs.validation.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
import * as guardMiddleware from "../middleware/guard.middleware.js";
import * as runsController from "../controllers/runs.controller.js";

const runsRouter = express.Router();

runsRouter.get(
  "/:id",
  runsValidation.validateUUID("id"),
  runsController.getRunById,
);

runsRouter.patch(
  "/:id",
  runsValidation.validateRun({ mode: "require_some" }),
  authMiddleware.checkAuth,
  guardMiddleware.checkPermissions({
    mode: "either",
    param: "id",
    type: "runId",
  }),
  runsController.updateRunById,
);

runsRouter.delete(
  "/:id",
  runsValidation.validateUUID("id"),
  authMiddleware.checkAuth,
  guardMiddleware.checkPermissions({
    mode: "either",
    param: "id",
    type: "runId",
  }),
  runsController.deleteRunById,
);

export default runsRouter;
