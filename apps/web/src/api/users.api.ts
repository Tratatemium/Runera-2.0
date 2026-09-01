import type {
  UserState,
  UserResponse,
  UserUpdateResponse,
  UserStatsResponse,
} from "@runera/shared";

import { apiRequest } from "./client";
import { API } from "@/config/apiConfig";
import { jsonOptions } from "@/utils/api.utils";

function apiGetMe(suppressUnauthorized: boolean) {
  return apiRequest<UserResponse>({
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

function apiGetMyStats() {
  return apiRequest<UserStatsResponse>({
    path: API.users.stats,
    assertData: true,
    options: { method: "GET" },
  });
}

export { apiGetMe, apiUpdateProfile, apiGetMyStats };
