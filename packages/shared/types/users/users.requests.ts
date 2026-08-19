import type { UserState } from "./users.types";

interface UpdateUserRequest {
  profile: UserState["profile"];
}

export type { UpdateUserRequest };
