import type { SignupData, LoginData } from "../types/auth.types";

import { apiSignup, apiLogin, apiLogout } from "../api/auth.api";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useRuns } from "./useRuns";
import { useUser } from "./useUser";

import { mapUserResponseToState } from "../utils/user.utils";
import { handleApiFormError } from "../utils/api.utils";

interface UseAuthReturn {
  signup: (payload: SignupData) => Promise<Record<string, string> | undefined>;
  login: (payload: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  isFetching: boolean;
  formError: string | undefined;
}

function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const { loginUser, logoutUser } = useAuthContext();
  const { getMe } = useUser();
  const { getMyRuns } = useRuns();

  const [isFetching, setIsFetching] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  async function signup(payload: SignupData) {
    setIsFetching(true);
    setFormError(undefined);

    try {
      await apiSignup(payload);
      navigate("/login");
    } catch (err) {
      const fieldErrors = handleApiFormError(err, setFormError);
      if (fieldErrors) return fieldErrors;
    } finally {
      setIsFetching(false);
    }
  }

  async function login(payload: LoginData) {
    logoutUser();
    setIsFetching(true);
    setFormError(undefined);

    try {
      await apiLogin(payload);
      const userData = await getMe();
      loginUser(mapUserResponseToState(userData));
      await getMyRuns();
      navigate("/user/dashboard");
    } catch (err) {
      handleApiFormError(err, setFormError);
    } finally {
      setIsFetching(false);
    }
  }

  async function logout() {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Failed to log out via API: ", err);
    } finally {
      logoutUser();
      navigate("/", { replace: true });
    }
  }

  return { signup, login, logout, isFetching, formError };
}

export { useAuth };
