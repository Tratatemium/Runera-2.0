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

import { getScaleColor } from "./general.utils";
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

type Splits = {
  split: string;
  pace: number;
}[];

function generateSplits(n: number, avg: number, div: number): Splits {
  if (n < 1) throw new Error("n must be at least 1");

  const min = avg - div;
  const max = avg + div;

  const values = Array.from(
    { length: n - 1 },
    () => Math.random() * (max - min) + min,
  ).map((value) => Number(value.toFixed(2)));

  const last = Number(
    (n * avg - values.reduce((sum, value) => sum + value, 0)).toFixed(2),
  );

  if (last < min || last > max) {
    return generateSplits(n, avg, div);
  }

  const finalSplits = [...values, last];

  return finalSplits.map((split, i) => {
    return { split: (i + 1).toString(), pace: split };
  });
}

function colorizeSplits(splits: Splits) {
  const min = splits.reduce(
    (min, split) => Math.min(min, split.pace),
    splits[0].pace,
  );
  const max = splits.reduce(
    (max, split) => Math.max(max, split.pace),
    splits[0].pace,
  );
  const step = (max - min) / 100;

  const getsScale = (pace: number) => Math.floor((pace - min) / step);

  return splits.map((split) => {
    return { ...split, color: getScaleColor(getsScale(split.pace)) };
  });
}

export {
  normalizeMyRuns,
  normalizeRunData,
  getRunData,
  prepareRunStateValues,
  calculatePace,
  getFieldPresentation,
  generateSplits,
  colorizeSplits,
};
