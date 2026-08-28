import type {
  SignupData,
  SignupResponse,
  LoginData,
} from "../types/auth.types";

import { apiRequest } from "./client";
import { API } from "../config/apiConfig";
import { jsonOptions } from "../utils/api.utils";

function apiSignup(data: SignupData) {
  return apiRequest<SignupResponse>({
    path: API.auth.signup,
    assertData: false,
    options: jsonOptions("POST", data),
  });
}

function apiLogin(data: LoginData) {
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
