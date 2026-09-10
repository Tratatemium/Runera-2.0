interface RunApi {
  runId: string;
  userId: string;
  runType: "base" | "recovery" | "tempo" | "longRun" | "interval" | "race";
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

type RunResponse = { runData: RunApi };
type MyRunsResponse = { myRuns: RunApi[] };

export type { RunApi, RunResponse, MyRunsResponse };
