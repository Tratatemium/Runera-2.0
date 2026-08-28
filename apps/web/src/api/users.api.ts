import type {
  UserState,
  UserApiResponse,
  UserUpdateResponse,
} from "../types/users.types";

import { apiRequest } from "./client";
import { API } from "../config/apiConfig";
import { jsonOptions } from "../utils/api.utils";

function apiGetMe(suppressUnauthorized: boolean) {
  return apiRequest<UserApiResponse>({
    path: API.users.me,
    assertData: true,
    suppressUnauthorized,
    options: { method: "GET" },
  });
}

function apiUpdateProfile(data: { profile: UserState["profile"] }) {
  return apiRequest<UserUpdateResponse>({
    path: API.users.profile,
    assertData: true,
    options: jsonOptions("PATCH", data),
  });
}

export { apiGetMe, apiUpdateProfile };
