import type { UpdateProfileRequest, UserResponse } from "@runera/shared";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { apiGetMe, apiUpdateProfile, apiGetMyStats } from "@/api/users.api";
import { useAuthContext } from "@/context/AuthContext";
import { handleApiFormError } from "@/utils/api.utils";
import { normalizeProfile, normalizeUserResponse } from "@/utils/user.utils";

interface UseUserReturn {
  isFetching: boolean;
  formError: string | undefined;
  updateProfile: (
    payload: UpdateProfileRequest,
  ) => Promise<Record<string, string> | undefined>;
  getMe: (opts?: { suppressUnauthorized?: boolean }) => Promise<UserResponse>;
  updateStats: () => Promise<void>;
}

function useUser(): UseUserReturn {
  const router = useRouter();
  const { updateUser } = useAuthContext();

  const [isFetching, setIsFetching] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const getMe = useCallback(async ({ suppressUnauthorized = false } = {}) => {
    const userData = await apiGetMe(suppressUnauthorized);
    return normalizeUserResponse(userData);
  }, []);

  const updateProfile = useCallback(
    async (
      payload: UpdateProfileRequest,
    ): Promise<Record<string, string> | undefined> => {
      setIsFetching(true);
      setFormError(undefined);

      try {
        const response = await apiUpdateProfile(payload);
        const updateFields = normalizeProfile(response.savedProfile);
        updateUser({ profile: updateFields });
        router.push("/user/info");
      } catch (err) {
        const fieldErrors = handleApiFormError(err, setFormError);
        if (fieldErrors) return fieldErrors;
      } finally {
        setIsFetching(false);
      }
    },
    [router, updateUser],
  );

  const updateStats = useCallback(async () => {
    setIsFetching(true);
    const stats = await apiGetMyStats();
    updateUser({ stats });
    setIsFetching(false);
  }, [updateUser]);

  return { isFetching, formError, getMe, updateProfile, updateStats };
}

export { useUser };
