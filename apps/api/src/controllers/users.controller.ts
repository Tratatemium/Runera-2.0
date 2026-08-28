import type { Request, Response } from "express";

import * as usersService from "../services/users.service.js";
import * as authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.utils.js";
import { getIdFromRequestParams } from "../utils/general.utils.js";

async function getUserById(req: Request, res: Response) {
  const userId = getIdFromRequestParams(req);
  const userData = await usersService.getUser(userId);
  sendSuccess(res, { statusCode: 200, data: { userData } });
}

async function getAllUsers(req: Request, res: Response) {
  const usersData = await usersService.getAllUsers();
  sendSuccess(res, {
    statusCode: 200,
    data: { usersData },
    extra: { results: usersData.length },
  });
}

async function getMe(req: Request, res: Response) {
  const userId = req.user.userId;
  const userData = await usersService.getUser(userId);
  sendSuccess(res, { statusCode: 200, data: { userData } });
}

async function updateProfile(req: Request, res: Response) {
  const userId = req.user.userId;
  const profile = req.body.profile;
  const savedProfile = await usersService.updateProfile(userId, profile);
  sendSuccess(res, { statusCode: 200, data: { savedProfile } });
}

async function updateAccount(req: Request, res: Response) {
  const { userId, email: currentEmail } = req.user;
  const currentPassword = req.body.currentPassword;
  await authService.authenticateUser(currentEmail, currentPassword);

  const fieldToUpdate = req.fieldToUpdate;
  if (!fieldToUpdate) {
    throw new Error("req.fieldToUpdate must be provided in middleware.");
  }
  await usersService.updateAccount(userId, fieldToUpdate, req.body);
  await authService.invalidatePreviousAccessTokens(userId);
  res.sendStatus(200);
}

export { getUserById, getAllUsers, getMe, updateProfile, updateAccount };
