interface RunRequest {
  runType: "base" | "recovery" | "tempo" | "longRun" | "interval" | "race";
  startTime: string;
  durationSec: number;
  distanceMeters: number;
  title?: string;
  notes?: string;
  perceivedEffort?: number;
  weather?:
    | "sunny"
    | "partlyCloudy"
    | "cloudy"
    | "rain"
    | "snow"
    | "windy"
    | "hot"
    | "cold";
}

export type { RunRequest };
