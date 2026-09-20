import type { UserStatsResponse } from "./users.responses";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
type Weekday = (typeof WEEKDAYS)[number];

type Gender = "female" | "male" | "non_binary" | "prefer_not_to_say";
type ExperienceLevel = "beginner" | "some" | "experienced" | "competitive";
type RunType = "easy" | "long" | "tempo" | "intervals";
type HealthConsideration =
  | "previous_injury"
  | "current_injury"
  | "breathing"
  | "joint_mobility"
  | "other";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // ISO "YYYY-MM-DD"
  heightCm?: number;
  weightKg?: number;
  gender?: Gender;
  runningExperience?: ExperienceLevel;
}

interface RunningPreferences {
  constraints: {
    availableDays?: Weekday[];
    maxRunMinutes?: number;
  };
  preferences: {
    runsPerWeek?: number | "flexible";
    longRunDay?: Weekday;
    runTypes?: RunType[];
  };
  notes?: string;
}

interface HealthConsiderations {
  items: HealthConsideration[]; // empty = answered "no"
  notes?: string;
}

interface UserState {
  account: { email: string; username: string };
  profile: UserProfile;
  runningPreferences: RunningPreferences;
  health?: HealthConsiderations; // undefined = not answered
  stats: UserStatsResponse;
  role: "user" | "admin";
}

export type {
  UserState,
  UserProfile,
  RunningPreferences,
  HealthConsiderations,
};
