import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";
import { useRuns } from "../../hooks/useRuns";
import { useUser } from "../../hooks/useUser";

import { mapUserResponseToState } from "../../utils/user.utils";

import { Loading } from "../ui/";

function RequireAuth() {
  const { user, loginUser } = useAuthContext();
  const location = useLocation();
  const { getMe } = useUser();
  const { getMyRuns } = useRuns();

  const [checking, setChecking] = useState(!user);

  useEffect(() => {
    if (user) return;
    let mounted = true;

    async function fetchUser() {
      try {
        const userData = await getMe({ suppressUnauthorized: true });
        if (!mounted) return;
        loginUser(mapUserResponseToState(userData));
        void getMyRuns();
      } catch {
        // Expected: user not authenticated, nothing to do
      } finally {
        if (mounted) setChecking(false);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [user, getMe, loginUser, getMyRuns]);

  if (checking) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export { RequireAuth };
