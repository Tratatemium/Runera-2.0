import type { UserStatsResponse } from "./users.responses";

interface UserState {
  account: {
    email: string;
    username: string;
  };
  profile: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    heightCm?: number;
    weightKg?: number;
  };
  stats: UserStatsResponse;
  role: "user" | "admin";
}

export type { UserState };
