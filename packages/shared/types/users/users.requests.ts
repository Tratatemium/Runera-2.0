import type { UserState } from "./users.types";

interface UpdateProfileRequest {
  profile: UserState["profile"];
}

type UpdateAccountRequest =
  | {
      currentPassword: string;
      newPassword: string;
      newEmail: never;
      newUsername: never;
    }
  | {
      currentPassword: string;
      newPassword: never;
      newEmail: string;
      newUsername: never;
    }
  | {
      currentPassword: string;
      newPassword: never;
      newEmail: never;
      newUsername: string;
    };

export type { UpdateProfileRequest, UpdateAccountRequest };
