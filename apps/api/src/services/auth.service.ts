import * as userRepo from "../repositories/users.repository.js";
import {
  createPasswordHash,
  comparePasswordHash,
} from "../utils/password.utils.js";
import { createToken } from "../utils/jwt.utils.js";
import { DBUser } from "../models/users.models.js";

async function signup(email: string, username: string, password: string) {
  const { passwordHash, passwordMetadata } = await createPasswordHash(password);
  const newUser = {
    role: "user" as const,
    credentials: { passwordHash, passwordMetadata },
    auth: {
      accessTokenVersion: 0,
    },
    account: {
      username,
      email,
      lastLogin: undefined,
    },
    profile: {},
  };

  const newUserId = await userRepo.addNewUser(newUser);
  return newUserId;
}

async function updatePassword(userId: string, newPassword: string) {
  const newCredentials = await createPasswordHash(newPassword);
  const result = await userRepo.updateCredentials(userId, newCredentials);
  return result;
}

async function authenticateUser(identifier: string, password: string) {
  const user = await userRepo.findUserByEmailOrUsername(identifier);
  await comparePasswordHash(user, password);
  return user as DBUser; // comparePasswordHash already throws LoginError for not found user
}

async function login(identifier: string, password: string) {
  const user = await authenticateUser(identifier, password);
  //TODO: implement failed login attempts check
  const token = createToken(user);
  await userRepo.updateLastLogin(user);
  return token;
}

// NOTE: change this if refresh tokens are implemented to generalized func
async function invalidatePreviousAccessTokens(userId: string) {
  await userRepo.incrementAccessTokenVersion(userId);
}

export {
  signup,
  updatePassword,
  authenticateUser,
  login,
  invalidatePreviousAccessTokens,
};
