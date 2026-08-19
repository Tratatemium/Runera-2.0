import type { UserState } from "./users/users.types";

interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

interface SignupResponse {
  userId: string;
}

interface AuthContextValue {
  user: UserState | null;
  loginUser: (user: UserState) => void;
  logoutUser: () => void;
  updateUser: (updates: Partial<UserState>) => void;
}

export type { SignupRequest, SignupResponse, LoginRequest, AuthContextValue };
