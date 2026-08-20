import { randomUUID } from "crypto";

import Run from "../models/runs.models.js";

async function addNewRun(newRun) {
  const newRunId = randomUUID();
  const runToInsert = { runId: newRunId, ...newRun };
  const savedRun = await Run.create(runToInsert);
  console.log("New run added to the database. ID:", newRunId);
  return savedRun;
}

async function findRunsByUserId(userId) {
  return await Run.find({ userId: userId }).sort({ startTime: -1, runId: 1 }); // most recent first
}

async function findRunById(runId) {
  const selectedRun = await Run.findOne({
    runId: runId,
  });
  return selectedRun || null;
}

async function updateRunById(runId, update) {
  const result = await Run.findOneAndUpdate(
    { runId },
    { $set: update },
    { new: true },
  );
  return result || null;
}

async function deleteRunById(runId) {
  return await Run.deleteOne({
    runId: runId,
  });
}

export {
  addNewRun,
  findRunsByUserId,
  findRunById,
  deleteRunById,
  updateRunById,
};
