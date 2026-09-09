import type { UserState, UserResponse } from "@runera/shared";

import { nullUserStats } from "@runera/shared";
import { normalizeDate, normalizeFormValue } from "./normalize.utils";

const mapUserResponseToState = (data: UserResponse): UserState => ({
  account: {
    email: data.userData.account.email,
    username: data.userData.account.username,
  },
  profile: {
    firstName: data.userData.profile.firstName,
    lastName: data.userData.profile.lastName,
    dateOfBirth: data.userData.profile.dateOfBirth,
    heightCm: data.userData.profile.heightCm,
    weightKg: data.userData.profile.weightKg,
  },
  stats: nullUserStats,
  role: data.userData.role,
});

const accountKeys = ["email", "username"] as const;
const profileKeys = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "heightCm",
  "weightKg",
] as const;

type UserAccountKey = (typeof accountKeys)[number];
type UserProfileKey = (typeof profileKeys)[number];
type UserKey = UserAccountKey | UserProfileKey;

function getUserData(user: UserState | null) {
  if (!user) return undefined;

  const merged = {
    ...user.account,
    ...user.profile,
  };

  return Object.fromEntries(
    Object.entries(merged).map(([key, value]) => [
      key,
      normalizeFormValue(value as string | number | undefined),
    ]),
  );
}

function normalizeProfile(profile: UserState["profile"]): UserState["profile"] {
  const normalized = { ...profile };

  if (normalized.dateOfBirth) {
    normalized.dateOfBirth = normalizeDate(normalized.dateOfBirth);
  }

  return normalized;
}

function normalizeUserResponse(data: UserResponse): UserResponse {
  const normalized: UserResponse = {
    ...data,
    userData: {
      ...data.userData,
      profile: data.userData.profile
        ? normalizeProfile(data.userData.profile)
        : data.userData.profile,
    },
  };

  return normalized;
}

export type { UserKey };
export {
  mapUserResponseToState,
  getUserData,
  normalizeProfile,
  normalizeUserResponse,
};
