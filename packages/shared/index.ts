/* ================================================================================================= */
/*  TYPES                                                                                            */
/* ================================================================================================= */
export type { Prettify } from "./types/general.types.js";

export type {
  Run,
  RunsState,
  RunsContextValue,
} from "./types/runs/runs.types.js";
export type { RunRequest } from "./types/runs/runs.requests.js";
export type {
  RunApi,
  RunResponse,
  MyRunsResponse,
} from "./types/runs/runs.responses.js";

export type {
  UserState,
  UserProfile,
  RunningPreferences,
  HealthConsiderations,
} from "./types/users/users.types.js";
export type {
  UpdateProfileRequest,
  UpdateRunningProfileRequest,
  UpdateAccountRequest,
} from "./types/users/users.requests.js";
export type {
  UserResponse,
  UserUpdateResponse,
  UserStatsResponse,
} from "./types/users/users.responses.js";
export { nullUserStats } from "./types/users/users.responses.js";

export type { ApiResponse } from "./types/api.types.js";
export type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  AuthContextValue,
} from "./types/auth.types.js";
export type { ErrorData } from "./types/error.types.js";
export type {
  InputFieldConfig,
  FormStateValue,
  FormAction,
  UseFormStateReturn,
  NormalizedFormValue,
  FormData,
  UseFormHandlersReturn,
} from "./types/forms.types.js";

/* ================================================================================================= */
/*  UTILS                                                                                            */
/* ================================================================================================= */

export { hasKey, assertAllowed } from "./utils/general.utils.js";
