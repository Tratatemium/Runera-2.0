import type { DBUser, DBCredentials } from "../models/users.models.js";
import type { DBRun } from "../models/runs.models.js";
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

interface AggregatedPeriodStats {
  totalRuns: number;
  totalTimeSec: number;
  totalDistanceMeters: number;
}

interface AggregatedStats {
  week: [] | AggregatedPeriodStats[];
  year: [] | AggregatedPeriodStats[];
  allTime: [] | AggregatedPeriodStats[];
  longestRun: [] | DBRun[];
  longestRunDuration: [] | DBRun[];
  fastestPace: [] | DBRun[];
  "1k": [] | DBRun[];
  "5k": [] | DBRun[];
  "10k": [] | DBRun[];
  halfMarathon: [] | DBRun[];
  marathon: [] | DBRun[];
}

async function getUserStats(userId: string) {
  const { weekStart, weekEnd, yearStart, yearEnd } = getTimeIntervals();

  const [result] = await Run.aggregate<AggregatedStats>([
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
          {
            $project: {
              _id: 0,
              totalRuns: 1,
              totalDistanceMeters: 1,
              totalTimeSec: 1,
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
          {
            $project: {
              _id: 0,
              totalRuns: 1,
              totalDistanceMeters: 1,
              totalTimeSec: 1,
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
          {
            $project: {
              _id: 0,
              totalRuns: 1,
              totalDistanceMeters: 1,
              totalTimeSec: 1,
            },
          },
        ],
        longestRun: [{ $sort: { distanceMeters: -1 } }, { $limit: 1 }],
        longestRunDuration: [{ $sort: { durationSec: -1 } }, { $limit: 1 }],
        fastestPace: [{ $sort: { paceSecPerKm: 1 } }, { $limit: 1 }],
        "1k": [
          {
            $match: {
              distanceMeters: {
                $gte: 1000,
                $lt: 5000,
              },
            },
          },
          { $sort: { paceSecPerKm: 1 } },
          { $limit: 1 },
        ],
        "5k": [
          {
            $match: {
              distanceMeters: {
                $gte: 5000,
                $lt: 10000,
              },
            },
          },
          { $sort: { paceSecPerKm: 1 } },
          { $limit: 1 },
        ],
        "10k": [
          {
            $match: {
              distanceMeters: {
                $gte: 10000,
                $lt: 21097.5,
              },
            },
          },
          { $sort: { paceSecPerKm: 1 } },
          { $limit: 1 },
        ],
        halfMarathon: [
          {
            $match: {
              distanceMeters: {
                $gte: 21097.5,
                $lt: 42195,
              },
            },
          },
          { $sort: { paceSecPerKm: 1 } },
          { $limit: 1 },
        ],
        marathon: [
          {
            $match: {
              distanceMeters: {
                $gte: 42195,
              },
            },
          },
          { $sort: { paceSecPerKm: 1 } },
          { $limit: 1 },
        ],
      },
    },
  ]);

  return result;
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

export type { AggregatedStats, AggregatedPeriodStats };
