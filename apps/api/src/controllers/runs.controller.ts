import type { Request, Response } from "express";

import * as runsService from "../services/runs.service.js";
import { sendSuccess } from "../utils/response.utils.js";
import { getIdFromRequestParams } from "../utils/general.utils.js";

async function postNewRun(req: Request, res: Response) {
  const userId = req.user.userId;
  const newRun = { userId, ...req.runData };
  const runData = await runsService.createRun(newRun);
  sendSuccess(res, { statusCode: 201, data: { runData } });
}

async function getMyRuns(req: Request, res: Response) {
  const userId = req.user.userId;
  const myRuns = await runsService.getRunsByUser(userId);
  sendSuccess(res, {
    statusCode: 200,
    data: { myRuns },
    extra: { results: myRuns.length },
  });
}

async function getRunById(req: Request, res: Response) {
  const runId = getIdFromRequestParams(req);
  const runData = await runsService.getRunById(runId);
  sendSuccess(res, { statusCode: 200, data: { runData } });
}

async function updateRunById(req: Request, res: Response) {
  const runId = getIdFromRequestParams(req);
  const runUpdate = req.body;
  const runData = await runsService.updateRunById(runId, runUpdate);
  sendSuccess(res, { statusCode: 200, data: { runData } });
}

async function deleteRunById(req: Request, res: Response) {
  const runId = getIdFromRequestParams(req);
  await runsService.deleteRunById(runId);
  res.sendStatus(204);
}

export { postNewRun, getMyRuns, getRunById, updateRunById, deleteRunById };
