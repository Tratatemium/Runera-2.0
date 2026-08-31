import type { DBUser, DBCredentials } from "../models/users.models.js";
import type { UpdateProfileRequest } from "@runera/shared";

import { randomUUID } from "crypto";

import User from "../models/users.models.js";
import Run from "../models/runs.models.js";
import { getTimeIntervals } from "../utils/general.utils.js";

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

type NewUser = Omit<DBUser, "userId" | "_id" | "__v">;

async function addNewUser(newUser: NewUser) {
  const newUserId = randomUUID();
  const userToInsert = { userId: newUserId, ...newUser };
  const savedUser = await User.create(userToInsert);
  console.log("New user added to the database. ID:", newUserId);
  return savedUser.userId;
}

async function updateProfile(
  userId: string,
  profilePatch: UpdateProfileRequest,
) {
  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(profilePatch)) {
    update[`profile.${key}`] = value;
  }
  const result = await User.findOneAndUpdate(
    { userId },
    { $set: update },
    { returnDocument: "after" },
  );
  return result?.profile ?? null;
}

async function updateAccount(
  userId: string,
  identifierName: string,
  newValue: string,
) {
  const result = await User.updateOne(
    { userId },
    { $set: { [`account.${identifierName}`]: newValue } },
  );
  return result;
}

async function updateCredentials(
  userId: string,
  newCredentials: DBCredentials,
) {
  const result = await User.updateOne(
    { userId },
    { $set: { credentials: newCredentials } },
  );
  return result;
}

async function incrementAccessTokenVersion(userId: string) {
  await User.updateOne({ userId }, { $inc: { "auth.accessTokenVersion": 1 } });
}

/* ================================================================================================= */
/*  STATS                                                                                            */
/* ================================================================================================= */

async function getUserStats(userId: string) {
  const { weekStart, weekEnd, yearStart, yearEnd } = getTimeIntervals();

  const stats = Run.aggregate([
    { $match: { userId } },
    {
      $facet: {
        week: [
          {
            $match: {
              date: {
                $gte: weekStart,
                $lt: weekEnd,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalRuns: { $sum: 1 },
              totalDistanceMeters: { $sum: "$distanceMeters" },
              totalTimeSec: { $sum: "$durationSec" },
            },
          },
        ],
        year: [
          {
            $match: {
              date: {
                $gte: yearStart,
                $lt: yearEnd,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalRuns: { $sum: 1 },
              totalDistanceMeters: { $sum: "$distanceMeters" },
              totalTimeSec: { $sum: "$durationSec" },
            },
          },
        ],
        allTime: [
          {
            $group: {
              _id: null,
              totalRuns: { $sum: 1 },
              totalDistanceMeters: { $sum: "$distanceMeters" },
              totalTimeSec: { $sum: "$durationSec" },
            },
          },
        ],
      },
    },
  ]);
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
  getUserStats,
};
