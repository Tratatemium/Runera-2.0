import type {
  Run,
  RunApi,
  RunResponse,
  MyRunsResponse,
  RunsState,
  RunRequest,
  FormData,
  FormStateValue,
} from "@runera/shared";

import {
  formatSeconds,
  normalizeDate,
  normalizeFormValue,
  normalizeTime,
} from "./normalize.utils";

function normalizeRun(run: RunApi): Run {
  const { createdAt: _, updatedAt: __, ...rest } = run;
  return {
    ...rest,
    startTime: normalizeTime(run.startTime),
    date: normalizeDate(run.date),

    formattedDuration: formatSeconds(run.durationSec, "compact"),
    distanceKm: Math.round(run.distanceMeters / 10) / 100,

    paceSecPerKm: Math.round(run.paceSecPerKm),
    formattedPace: `${formatSeconds(run.paceSecPerKm, "compact")} /km`,
  };
}

function normalizeMyRuns(rawResponse: MyRunsResponse): RunsState {
  const entries = rawResponse.myRuns.map((run) => [
    run.runId,
    normalizeRun(run),
  ]);
  return Object.fromEntries(entries);
}

function normalizeRunData(runData: RunResponse): Run {
  return normalizeRun(runData.runData);
}

function getRunData(data: FormData): RunRequest {
  const { distanceKm, durationH, durationM, durationS, ...rest } = data;

  return {
    ...rest,
    distanceMeters: Number(distanceKm) * 1000,
    durationSec:
      Number(durationH) * 3600 + Number(durationM) * 60 + Number(durationS),
  } as RunRequest;
}

function splitDuration(durationSec: number) {
  const durationH = Math.floor(durationSec / 3600);
  const durationM = Math.floor((durationSec % 3600) / 60);
  const durationS = durationSec % 60;

  return { durationH, durationM, durationS };
}

function prepareRunStateValues(run: Run) {
  const updated = {
    ...run,
    ...splitDuration(run.durationSec),
  };
  return Object.fromEntries(
    Object.entries(updated).map(([k, v]) => [k, normalizeFormValue(v)]),
  );
}
function calculatePace(formState: FormStateValue) {
  const durationSec =
    Number(formState.durationH.value) * 3600 +
    Number(formState.durationM.value) * 60 +
    Number(formState.durationS.value);
  const pace = durationSec / Number(formState.distanceKm.value);
  if (!Number.isFinite(pace) || Number.isNaN(pace)) {
    return "";
  }
  return formatSeconds(pace, "compact");
}

export {
  normalizeMyRuns,
  normalizeRunData,
  getRunData,
  prepareRunStateValues,
  calculatePace,
};
