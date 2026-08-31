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

interface PeriodStats {
  totalRuns: number | null;
  totalTimeSec: number | null;
  totalDistanceMeters: number | null;
  avgPaceSecPerKm: number | null;
}

interface FastestRun {
  timeSec: number;
  paceSecPerKm: number;
  date: string;
  runId: string;
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

export type { UserResponse, UserUpdateResponse, UserStatsResponse };
