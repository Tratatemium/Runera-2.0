import type { Request, Response, NextFunction } from "express";

import { GuardError } from "../errors/errors.js";
import * as runsService from "../services/runs.service.js";

const ownershipResolvers = {
  userId: async (req: Request, param: string) => req.params[param],
  runId: async (req: Request, param: string) => {
    const runId = Array.isArray(req.params[param])
      ? req.params[param][0]
      : req.params[param];
    const run = await runsService.getRunById(runId);
    return run.userId;
  },
};

async function checkOwnership(
  req: Request,
  param: string,
  type: "userId" | "runId",
) {
  const providedId = req.user.userId;
  const resolver = ownershipResolvers[type];
  if (!resolver) throw new Error(`Unknown id type: ${type}`);

  let resourceId = await resolver(req, param);
  return providedId === resourceId;
}

interface CheckPermissionsOptions {
  mode: "admin" | "owner" | "either";
  param: "id";
  type: "userId" | "runId";
}

function checkPermissions({
  mode = "either",
  param = "id",
  type,
}: CheckPermissionsOptions) {
  if (!["admin", "owner", "either"].includes(mode)) {
    throw new Error('mode must be: "admin", "owner" or "either."');
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = req.user.role === "admin";
    if (mode === "admin") {
      if (!isAdmin) throw new GuardError("Admins only.");
      return next();
    }

    const isOwner = await checkOwnership(req, param, type);
    if (mode === "owner" && !isOwner) throw new GuardError("Owners only.");
    else if (mode === "either" && !isAdmin && !isOwner) throw new GuardError();

    next();
  };
}

export { checkPermissions };
