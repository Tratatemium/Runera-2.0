import type { UpdateUserRequest } from "@runera/shared";

import { NotFoundError } from "../errors/errors.js";
import * as usersRepo from "../repositories/users.repository.js";
import * as authService from "./auth.service.js";

function throwUserNotFoundError(userId: string) {
  throw new NotFoundError(`No user with ID ${userId} found!`);
}

async function getUser(userId: string) {
  const userData = await usersRepo.findUserById(userId);
  if (!userData) throwUserNotFoundError(userId);
  return userData;
}

async function getAllUsers() {
  const usersData = await usersRepo.findAllUsers();
  return usersData;
}

async function updateProfile(userId: string, profilePatch: UpdateUserRequest) {
  const savedProfile = await usersRepo.updateProfile(userId, profilePatch);
  if (!savedProfile) throwUserNotFoundError(userId);
  return savedProfile;
}

async function updateAccount(userId: string, fieldToUpdate: string, reqBody) {
  const updateHandlers = {
    password: (userId, reqBody) =>
      authService.updatePassword(userId, reqBody.newPassword),
    email: (userId, reqBody) =>
      usersRepo.updateAccount(userId, "email", reqBody.newEmail),
    username: (userId, reqBody) =>
      usersRepo.updateAccount(userId, "username", reqBody.newUsername),
  };

  const handler = updateHandlers[fieldToUpdate];
  if (!handler) {
    throw new Error("Invalid fieldToUpdate");
  }

  const result = await handler(userId, reqBody);
  if (result?.matchedCount === 0) throwUserNotFoundError(userId);
}

export { getUser, getAllUsers, updateProfile, updateAccount };
