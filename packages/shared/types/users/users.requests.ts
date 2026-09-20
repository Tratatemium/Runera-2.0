import type { UserState } from "./users.types";

type UpdateProfileRequest = Pick<UserState, "profile">;
type UpdateRunningProfileRequest = Pick<
  UserState,
  "runningPreferences" | "health"
>;

type UpdateAccountRequest =
  | {
      currentPassword: string;
      newPassword: string;
      newEmail?: never;
      newUsername?: never;
    }
  | {
      currentPassword: string;
      newPassword?: never;
      newEmail: string;
      newUsername?: never;
    }
  | {
      currentPassword: string;
      newPassword?: never;
      newEmail?: never;
      newUsername: string;
    };

export type {
  UpdateProfileRequest,
  UpdateAccountRequest,
  UpdateRunningProfileRequest,
};
