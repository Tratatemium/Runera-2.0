import type { Run } from "@runera/shared";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { Panel } from "@/components/ui";

import styles from "./page.module.css";

interface RunPageProps {
  params: Promise<{
    runId: string;
  }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { runId } = await params;

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

  return (
    <main className={styles.main}>
      <Panel variant="gradientAccent" className={styles.panel}></Panel>
    </main>
  );
}
