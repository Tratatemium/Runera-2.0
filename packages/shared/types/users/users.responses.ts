import type {
  UserProfile,
  RunningPreferences,
  HealthConsiderations,
} from "./users.types.js";

interface UserResponse {
  userData: {
    userId: string;
    account: {
      email: string;
      lastLogin: string;
      username: string;
    };
    profile: UserProfile;
    runningPreferences: RunningPreferences;
    health?: HealthConsiderations;
    role: "user" | "admin";
    createdAt: string;
    updatedAt: string;
  };
}

interface UserUpdateResponse {
  savedProfile: Pick<UserResponse["userData"], "profile">;
}

interface RunningProfileUpdateResponse {
  savedRunningProfile: Pick<
    UserResponse["userData"],
    "runningPreferences" | "health"
  >;
}

type PeriodStats =
  | {
      totalRuns: null;
      totalTimeSec: null;
      totalDistanceMeters: null;
      avgPaceSecPerKm: null;
    }
  | {
      avgPaceSecPerKm: number;
      totalRuns: number;
      totalTimeSec: number;
      totalDistanceMeters: number;
    };

interface RecordRun {
  runId: string;
  durationSec: number;
  distanceMeters: number;
  paceSecPerKm: number;
  date: string;
}

interface Records {
  longestRun: RecordRun | null;
  longestRunDuration: RecordRun | null;
  fastestPace: RecordRun | null;
  "1k": RecordRun | null;
  "5k": RecordRun | null;
  "10k": RecordRun | null;
  halfMarathon: RecordRun | null;
  marathon: RecordRun | null;
}

interface UserStatsResponse {
  allTime: PeriodStats;
  year: PeriodStats;
  week: PeriodStats;
  records: Records;
}

const nullUserStats: UserStatsResponse = {
  allTime: {
    totalRuns: null,
    totalTimeSec: null,
    totalDistanceMeters: null,
    avgPaceSecPerKm: null,
  },
  year: {
    totalRuns: null,
    totalTimeSec: null,
    totalDistanceMeters: null,
    avgPaceSecPerKm: null,
  },
  week: {
    totalRuns: null,
    totalTimeSec: null,
    totalDistanceMeters: null,
    avgPaceSecPerKm: null,
  },
  records: {
    longestRun: null,
    longestRunDuration: null,
    fastestPace: null,
    "1k": null,
    "5k": null,
    "10k": null,
    halfMarathon: null,
    marathon: null,
  },
};

export { nullUserStats };

export type {
  UserResponse,
  UserUpdateResponse,
  RunningProfileUpdateResponse,
  UserStatsResponse,
};
