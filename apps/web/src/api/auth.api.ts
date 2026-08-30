import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
} from "@runera/shared";

import { apiRequest } from "./client";
import { API } from "@/config/apiConfig";
import { jsonOptions } from "@/utils/api.utils";

function apiSignup(data: SignupRequest) {
  return apiRequest<SignupResponse>({
    path: API.auth.signup,
    assertData: false,
    options: jsonOptions("POST", data),
  });
}

function apiLogin(data: LoginRequest) {
  return apiRequest<void>({
    path: API.auth.login,
    assertData: false,
    options: jsonOptions("POST", data),
  });
}

function apiLogout() {
  return apiRequest<void>({
    path: API.auth.logout,
    assertData: false,
    options: { method: "POST" },
  });
}

export { apiSignup, apiLogin, apiLogout };
