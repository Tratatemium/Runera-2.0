"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import { useRuns, useUser } from "@/hooks";
import { mapUserResponseToState } from "@/utils/user.utils";
import { Loading } from "@/components/ui";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loginUser } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getMe, updateStats } = useUser();
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
        void updateStats();
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
  }, [user, getMe, updateStats, loginUser, getMyRuns]);

  useEffect(() => {
    if (checking || user) return;

    const from =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    router.replace(`/?from=${encodeURIComponent(from)}`);
  }, [checking, user, pathname, searchParams, router]);

  if (checking) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return children;
}

export { RequireAuth };
