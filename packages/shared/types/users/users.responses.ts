interface UserResponse {
  userData: {
    userId: string;
    account: {
      email: string;
      lastLogin: string;
      username: string;
    };
    profile: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      heightCm?: number;
      weightKg?: number;
    };
    role: "user" | "admin";
    createdAt: string;
    updatedAt: string;
  };
}

interface UserUpdateResponse {
  savedProfile: UserResponse["userData"]["profile"];
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

interface FastestRun {
  runId: string;
  durationSec: number;
  distanceMeters: number;
  paceSecPerKm: number;
  date: string;
}

interface FastestRuns {
  "1k": FastestRun | null;
  "5k": FastestRun | null;
  "10k": FastestRun | null;
  halfMarathon: FastestRun | null;
  marathon: FastestRun | null;
}

interface UserStatsResponse {
  allTime: PeriodStats;
  year: PeriodStats;
  week: PeriodStats;
  fastest: FastestRuns;
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
  fastest: {
    "1k": null,
    "5k": null,
    "10k": null,
    halfMarathon: null,
    marathon: null,
  },
};

export { nullUserStats };

export type { UserResponse, UserUpdateResponse, UserStatsResponse };
