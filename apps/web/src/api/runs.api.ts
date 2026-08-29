import type {
  RunResponse,
  MyRunsResponse,
  RunRequest,
} from "../types/runs.types";
import { apiRequest } from "./client";
import { API } from "../config/apiConfig";
import { joinUrl, jsonOptions } from "../utils/api.utils";

function apiGetMyRuns() {
  return apiRequest<MyRunsResponse>({
    path: API.runs.myRuns,
    assertData: true,
    options: { method: "GET" },
  });
}

function apiPostNewRun(data: RunRequest) {
  return apiRequest<RunResponse>({
    path: API.runs.myRuns,
    assertData: true,
    options: jsonOptions("POST", data),
  });
}

function apiUpdateRun(runId: string, data: RunRequest) {
  return apiRequest<RunResponse>({
    path: joinUrl(API.runs.runs, runId),
    assertData: true,
    options: jsonOptions("PATCH", data),
  });
}

function apiDeleteRun(runId: string) {
  return apiRequest<void>({
    path: joinUrl(API.runs.runs, runId),
    assertData: false,
    options: { method: "DELETE" },
  });
}

export { apiGetMyRuns, apiPostNewRun, apiUpdateRun, apiDeleteRun };
