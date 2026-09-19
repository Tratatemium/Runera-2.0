"use client";

import type { Run, RunsState } from "@runera/shared";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function useRunById(
  runId: string | undefined,
  runs: RunsState | undefined,
): Run | null {
  const router = useRouter();

  const run = runId && runs ? runs[runId] : undefined;

  useEffect(() => {
    if (!runId || !runs) return;
    if (!runs[runId]) router.replace("/not-found");
  }, [router, runId, runs]);

  return run ?? null;
}

export { useRunById };
