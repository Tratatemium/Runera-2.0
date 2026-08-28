import type { UpdateUserPayload, UserApiResponse } from "../types/users.types";

import { apiGetMe, apiUpdateProfile } from "../api/users.api";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { handleApiFormError } from "../utils/api.utils";
import { normalizeProfile, normalizeUserResponse } from "../utils/user.utils";

interface UseUserReturn {
  isFetching: boolean;
  formError: string | undefined;
  updateProfile: (
    payload: UpdateUserPayload,
  ) => Promise<Record<string, string> | undefined>;
  getMe: (opts?: {
    suppressUnauthorized?: boolean;
  }) => Promise<UserApiResponse>;
}

function useUser(): UseUserReturn {
  const navigate = useNavigate();
  const { updateUser } = useAuthContext();

  const [isFetching, setIsFetching] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const getMe = useCallback(async ({ suppressUnauthorized = false } = {}) => {
    const userData = await apiGetMe(suppressUnauthorized);
    return normalizeUserResponse(userData);
  }, []);

  const updateProfile = useCallback(
    async (
      payload: UpdateUserPayload,
    ): Promise<Record<string, string> | undefined> => {
      setIsFetching(true);
      setFormError(undefined);

      try {
        const response = await apiUpdateProfile(payload);
        const updateFields = normalizeProfile(response.savedProfile);
        updateUser({ profile: updateFields });
        navigate("/user/info");
      } catch (err) {
        const fieldErrors = handleApiFormError(err, setFormError);
        if (fieldErrors) return fieldErrors;
      } finally {
        setIsFetching(false);
      }
    },
    [navigate, updateUser],
  );

  return { isFetching, formError, getMe, updateProfile };
}

export { useUser };
