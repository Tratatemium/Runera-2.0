import type { RunRequest } from "@runera/shared";

import { NotFoundError } from "../errors/errors.js";
import * as runsRepo from "../repositories/runs.repository.js";
import { getStartOfDay } from "../utils/general.utils.js";
import { DBRun } from "../models/runs.models.js";

function throwRunNotFoundError(runId: string) {
  throw new NotFoundError(`No run with ID ${runId} found!`);
}

async function createRun(newRun: RunRequest) {
  const enriched = {
    ...newRun,
    date: getStartOfDay(newRun.startTime),
    paceSecPerKm: newRun.durationSec / (newRun.distanceMeters / 1000),
  };
  return await runsRepo.addNewRun(enriched);
}

async function getRunsByUser(userId: string) {
  const runs = await runsRepo.findRunsByUserId(userId);
  return runs;
}

async function getRunById(runId: string) {
  const runData = await runsRepo.findRunById(runId);
  if (!runData) throwRunNotFoundError(runId);
  return runData as DBRun;
}

async function updateRunById(runId: string, runUpdate: RunRequest) {
  const existingRun = await getRunById(runId);

  const startTime = runUpdate.startTime ?? existingRun.startTime;
  const durationSec = runUpdate.durationSec ?? existingRun.durationSec;
  const distanceMeters = runUpdate.distanceMeters ?? existingRun.distanceMeters;

  const enrichedUpdate = {
    ...runUpdate,
    date: getStartOfDay(startTime),
    paceSecPerKm: durationSec / (distanceMeters / 1000),
  };

  const updatedRun = await runsRepo.updateRunById(runId, enrichedUpdate);
  if (!updatedRun) {
    throwRunNotFoundError(runId);
  }
  return updatedRun;
}

async function deleteRunById(runId: string) {
  const result = await runsRepo.deleteRunById(runId);
  if (result.deletedCount === 0) throwRunNotFoundError(runId);
}

export { createRun, getRunById, getRunsByUser, updateRunById, deleteRunById };
