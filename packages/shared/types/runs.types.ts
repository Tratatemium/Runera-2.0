import type { Dispatch, SetStateAction } from "react";

interface Run {
  runId: string;
  userId: string;
  startTime: string;
  date: string;
  durationSec: number;
  formattedDuration: string;
  distanceMeters: number;
  distanceKm: number;
  paceSecPerKm: number;
  formattedPace: string;
  title?: string;
  notes?: string;
  perceivedEffort?: number;
  weather?:
    | "sunny"
    | "partly_cloudy"
    | "cloudy"
    | "rain"
    | "snow"
    | "windy"
    | "hot"
    | "cold";
}

type RunsState = Record<string, Run>;

interface RunsContextValue {
  runs: RunsState | undefined;
  isHydaratingRuns: boolean;
  setIsHydratingRuns: Dispatch<SetStateAction<boolean>>;
  hydrateRunsState: (runs: RunsState) => void;
  clearRunsState: () => void;
  postNewRunState: (newRun: Run) => void;
  updateRunState: (updatedRun: Run) => void;
  deleteRunState: (id: string) => void;
}

interface RunApi {
  runId: string;
  userId: string;
  startTime: string;
  date: string;
  durationSec: number;
  distanceMeters: number;
  paceSecPerKm: number;
  createdAt: string;
  updatedAt: string;
  title?: string;
  notes?: string;
  perceivedEffort?: number;
  weather?:
    | "sunny"
    | "partly_cloudy"
    | "cloudy"
    | "rain"
    | "snow"
    | "windy"
    | "hot"
    | "cold";
}

type RunApiResponse = { runData: RunApi };
type MyRunsApiResponse = { myRuns: RunApi[] };

interface RunData {
  startTime: string;
  durationSec: number;
  distanceMeters: number;
  title?: string;
  notes?: string;
  perceivedEffort?: number;
  weather?:
    | "sunny"
    | "partly_cloudy"
    | "cloudy"
    | "rain"
    | "snow"
    | "windy"
    | "hot"
    | "cold";
}

export type {
  Run,
  RunsState,
  RunsContextValue,
  RunApi,
  RunApiResponse,
  MyRunsApiResponse,
  RunData,
};
