import type { AuthContextValue } from "../types/auth.types";
import type { UserState } from "../types/users.types";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import merge from "lodash/merge";
import { AppError } from "../errors/errors";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserState | null>(null);

  const loginUser = useCallback((user: UserState) => setUser(user), []);
  const logoutUser = useCallback(() => setUser(null), []);
  const updateUser = useCallback((updates: Partial<UserState>) => {
    setUser((prev) => merge({}, prev, updates));
  }, []);

  useEffect(() => {
    const handler = () => {
      window.alert("Session expired. Please login again.");
      logoutUser();
    };
    window.addEventListener("unauthorized", handler);
    return () => window.removeEventListener("unauthorized", handler);
  }, [logoutUser]);

  const value = useMemo(
    () => ({ user, loginUser, logoutUser, updateUser }),
    [user, loginUser, logoutUser, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new AppError("useAuthContext must be used inside AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuthContext };
