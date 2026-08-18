import type { UserState } from "./users.types";

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface SignupResponse {
  userId: string;
}

interface LoginData {
  username?: string;
  email?: string;
  password: string;
}

interface AuthContextValue {
  user: UserState | null;
  loginUser: (user: UserState) => void;
  logoutUser: () => void;
  updateUser: (updates: Partial<UserState>) => void;
}

export type {
  SignupData,
  SignupResponse,
  LoginData,
  AuthContextValue,
};
