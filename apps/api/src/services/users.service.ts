import type {
  UpdateProfileRequest,
  UpdateAccountRequest,
} from "@runera/shared";

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

async function updateProfile(
  userId: string,
  profilePatch: UpdateProfileRequest,
) {
  const savedProfile = await usersRepo.updateProfile(userId, profilePatch);
  if (!savedProfile) throwUserNotFoundError(userId);
  return savedProfile;
}

async function updateAccount(
  userId: string,
  fieldToUpdate: "password" | "email" | "username",
  reqBody: UpdateAccountRequest,
) {
  let result;

  switch (fieldToUpdate) {
    case "password":
      result = await authService.updatePassword(userId, reqBody.newPassword);
      break;
    case "email":
      result = await usersRepo.updateAccount(userId, "email", reqBody.newEmail);
      break;
    case "username":
      result = await usersRepo.updateAccount(
        userId,
        "username",
        reqBody.newUsername,
      );
      break;
  }

  if (result?.matchedCount === 0) throwUserNotFoundError(userId);
}

export { getUser, getAllUsers, updateProfile, updateAccount };
