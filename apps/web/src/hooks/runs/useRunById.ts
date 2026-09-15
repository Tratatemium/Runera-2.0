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
    if (!run || !runId || !run) {
      router.replace("/not-found");
    }
  }, [router, runId, runs, run]);

  return run ?? null;
}

export { useRunById };
