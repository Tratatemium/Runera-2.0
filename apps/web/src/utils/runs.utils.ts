import type {
  Run,
  RunApi,
  RunResponse,
  MyRunsResponse,
  RunsState,
  RunRequest,
  FormData,
  FormStateValue,
  InputFieldConfig,
} from "@runera/shared";
import type { Icon } from "@/components/icons/icons";

import { assertAllowed } from "@runera/shared";
import {
  formatDuration,
  normalizeDate,
  normalizeFormValue,
  normalizeTime,
} from "./normalize.utils";

import { inputFields } from "@/config/inputFields";
import { icons } from "@/components/icons/icons";

function normalizeRun(run: RunApi): Run {
  const { createdAt: _, updatedAt: __, ...rest } = run;
  return {
    ...rest,
    startTime: normalizeTime(run.startTime),
    date: normalizeDate(run.date),

    formattedDuration: formatDuration(run.durationSec, "compact"),
    distanceKm: Math.round(run.distanceMeters / 10) / 100,

    paceSecPerKm: Math.round(run.paceSecPerKm),
    formattedPace: `${formatDuration(run.paceSecPerKm, "compact")} /km`,
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
  return formatDuration(pace, "compact");
}

function getFieldPresentation(
  run: Run,
  fieldName: "weather" | "runType",
): {
  label: string | null;
  Icon: Icon | null;
} {
  assertAllowed(fieldName, "fieldName", ["weather", "runType"]);

  const filteredFields: Record<string, InputFieldConfig> = Object.fromEntries(
    Object.entries(inputFields)
      .filter(([, field]) => field.name === fieldName)
      .map(([, field]) => [field.value, field]),
  );
  const label = run[fieldName] ? filteredFields[run[fieldName]]?.label : null;
  const Icon = run[fieldName]
    ? icons[fieldName][run[fieldName] as keyof (typeof icons)[typeof fieldName]]
    : null;

  return { label, Icon };
}

export {
  normalizeMyRuns,
  normalizeRunData,
  getRunData,
  prepareRunStateValues,
  calculatePace,
  getFieldPresentation,
};
