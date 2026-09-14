"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { Panel } from "@/components/ui";

import styles from "./RunItemFull.module.css";

interface RunItemFullProps {
  runId: string;
}

function RunItemFull({ runId }: RunItemFullProps) {
  const router = useRouter();
  const { runs, isHydratingRuns } = useRunsContext();
  const { loading, loadingRunId, deleteRun } = useRuns();

  useEffect(() => {
    if (!runId || !runs) return;
    if (!runs[runId]) {
      router.push("/not-found");
      return;
    }
  }, [router, runId, runs]);
  if (!runs || !runId) return null;
  const run = runs[runId];
  if (!run) return null;

  return <Panel variant="gradientAccent" className={styles.panel}></Panel>;
}

export { RunItemFull };
