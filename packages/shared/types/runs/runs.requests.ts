interface RunRequest {
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

export type { RunRequest };
