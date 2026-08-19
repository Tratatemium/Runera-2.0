import type { DBUser } from "../models/users.models.js";

import { randomUUID } from "crypto";

import User from "../models/users.models.js";

async function findUserById(userId: string) {
  const selectedUser = await User.findOne({ userId });
  return selectedUser || null;
}

async function findUserByField(field: string, value: unknown) {
  const selectedUser = await User.findOne({
    [field]: value,
  });
  return selectedUser || null;
}

async function findUserByEmailOrUsername(identifier: string) {
  const selectedUser = await User.findOne({
    $or: [{ "account.email": identifier }, { "account.username": identifier }],
  });
  return selectedUser || null;
}

async function findAllUsers() {
  const users = await User.find({});
  return users;
}

async function updateLastLogin(foundUser: DBUser) {
  const email = foundUser.account.email;
  const result = await User.updateOne(
    { "account.email": email },
    { $set: { "account.lastLogin": new Date() } },
  );
  return result;
}

async function addNewUser(newUser) {
  const newUserId = randomUUID();
  const userToInsert = { userId: newUserId, ...newUser };
  const savedUser = await User.create(userToInsert);
  console.log("New user added to the database. ID:", newUserId);
  return savedUser.userId;
}

async function updateProfile(userId, profilePatch) {
  const update = {};
  for (const [key, value] of Object.entries(profilePatch)) {
    update[`profile.${key}`] = value;
  }
  const result = await User.findOneAndUpdate(
    { userId },
    { $set: update },
    { new: true },
  );
  return result?.profile ?? null;
}

async function updateAccount(userId, identifierName, newValue) {
  const result = await User.updateOne(
    { userId },
    { $set: { [`account.${identifierName}`]: newValue } },
  );
  return result;
}

async function updateCredentials(userId, newCredentials) {
  const result = await User.updateOne(
    { userId },
    { $set: { credentials: newCredentials } },
  );
  return result;
}

async function incrementAccessTokenVersion(userId) {
  await User.updateOne({ userId }, { $inc: { "auth.accessTokenVersion": 1 } });
}

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

export {
  findUserById,
  findUserByField,
  findUserByEmailOrUsername,
  findAllUsers,
  updateLastLogin,
  addNewUser,
  updateProfile,
  updateAccount,
  updateCredentials,
  incrementAccessTokenVersion,
};
