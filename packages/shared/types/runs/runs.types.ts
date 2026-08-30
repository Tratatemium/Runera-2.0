// import type { Dispatch, SetStateAction } from "react";

type SetStateAction<T> = T | ((previousState: T) => T);
type Dispatch<T> = (value: T) => void;

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
  isHydratingRuns: boolean;
  setIsHydratingRuns: Dispatch<SetStateAction<boolean>>;
  hydrateRunsState: (runs: RunsState) => void;
  clearRunsState: () => void;
  postNewRunState: (newRun: Run) => void;
  updateRunState: (updatedRun: Run) => void;
  deleteRunState: (id: string) => void;
}

export type { Run, RunsState, RunsContextValue };
