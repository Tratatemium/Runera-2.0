import type { SignupRequest, LoginRequest } from "@runera/shared";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiSignup, apiLogin, apiLogout } from "@/api/auth.api";
import { useAuthContext } from "@/context/AuthContext";
import { useRuns, useUser } from "@/hooks";
import { mapUserResponseToState } from "@/utils/user.utils";
import { handleApiFormError } from "@/utils/api.utils";

interface UseAuthReturn {
  signup: (
    payload: SignupRequest,
  ) => Promise<Record<string, string> | undefined>;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isFetching: boolean;
  formError: string | undefined;
}

function useAuth(): UseAuthReturn {
  const router = useRouter();
  const { loginUser, logoutUser } = useAuthContext();
  const { getMe, updateStats } = useUser();
  const { getMyRuns } = useRuns();

  const [isFetching, setIsFetching] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  async function signup(payload: SignupRequest) {
    setIsFetching(true);
    setFormError(undefined);

    try {
      await apiSignup(payload);
      router.push("/login");
    } catch (err) {
      const fieldErrors = handleApiFormError(err, setFormError);
      if (fieldErrors) return fieldErrors;
    } finally {
      setIsFetching(false);
    }
  }

  async function login(payload: LoginRequest) {
    logoutUser();
    setIsFetching(true);
    setFormError(undefined);

    try {
      await apiLogin(payload);
      const userData = await getMe();
      loginUser(mapUserResponseToState(userData));
      await getMyRuns();
      await updateStats();
      router.push("/user/dashboard");
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
      router.replace("/");
    }
  }

  return { signup, login, logout, isFetching, formError };
}

export { useAuth };
