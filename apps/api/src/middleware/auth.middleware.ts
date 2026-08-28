import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../utils/jwt.utils.js";

import { verifyToken } from "../utils/jwt.utils.js";
import * as userRepo from "../repositories/users.repository.js";
import { AuthError } from "../errors/errors.js";

async function checkTokenVersion(tokenData: TokenPayload) {
  const storedUser = await userRepo.findUserById(tokenData.userId);
  if (!storedUser) throw new AuthError("Invalid token.");

  const { accessTokenVersion: incomingVersion } = tokenData;
  const storedVersion = storedUser.auth?.accessTokenVersion;

  const isVersionValid = (incomingVersion: number, storedVersion: number) =>
    incomingVersion != null &&
    storedVersion != null &&
    incomingVersion === storedVersion;

  if (!isVersionValid(incomingVersion, storedVersion))
    throw new AuthError("Invalid token.");
}

async function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) throw new AuthError("Missing authentication token.");

  const userData = verifyToken(token);

  await checkTokenVersion(userData);

  req.user = userData;
  next();
}

export { checkAuth };
