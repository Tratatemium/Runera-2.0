"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useRuns, useRunListControls } from "@/hooks";
import { useRunsContext } from "@/context/RunsContext";
import { icons } from "@/components/icons/icons";
import { Loading, Panel } from "@/components/ui";
import { StatsPanel } from "@/components/user";
import { RunItem } from "@/components/runs";

import styles from "./page.module.css";

const SpinnerIcon = icons.spinners.spinner;
const PlusIcon = icons.general.plus;
type SortOption =
  | "startTimeNewest"
  | "startTimeOldest"
  | "distanceLongest"
  | "distanceShortest";

export default function MyRuns() {
  const { runs, isHydratingRuns } = useRunsContext();
  const { loading, loadingRunId, deleteRun } = useRuns();

  const [enteringRunIds, setEnteringRunIds] = useState<Record<string, true>>(
    {},
  );
  const prevRunIdsRef = useRef<Set<string>>(new Set());
  const hasInitializedRef = useRef(false);

  const runsArray = useMemo(() => {
    if (!runs) return [];
    return Object.values(runs);
  }, [runs]);

  const { filterBy, setFilterBy, sortBy, setSortBy, finalRunsArray } =
    useRunListControls(runsArray);

  useEffect(() => {
    const currentRunIds = new Set(runsArray.map((run) => run.runId));

    if (!hasInitializedRef.current) {
      prevRunIdsRef.current = currentRunIds;
      hasInitializedRef.current = true;
      return;
    }

    const addedRunIds: string[] = [];
    currentRunIds.forEach((runId) => {
      if (!prevRunIdsRef.current.has(runId)) {
        addedRunIds.push(runId);
      }
    });

    if (addedRunIds.length > 0) {
      setEnteringRunIds((prev) => {
        const next = { ...prev };
        addedRunIds.forEach((runId) => {
          next[runId] = true;
        });
        return next;
      });
    }

    prevRunIdsRef.current = currentRunIds;
  }, [runsArray]);

  return !isHydratingRuns ? (
    <main className={styles.main}>
      <Panel variant="opaqueAccent" className={styles.panel}>
        <div className={styles.greeting}>
          <h1>My Runs</h1>
          <p>Your complete running history.</p>
        </div>

        <StatsPanel type="shortStats"></StatsPanel>

        <div className={styles.listControls}>
          <div className={styles.filterWrapper}>
            <button></button>
            <button></button>
            <button></button>
            <button></button>
          </div>
          <div className={styles.sortingRow}>
            <label htmlFor="runs-sort" className={styles.sortingLabel}>
              Sort
            </label>
            <select
              id="runs-sort"
              className={styles.sortingSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="startTimeNewest">Newest first</option>
              <option value="startTimeOldest">Oldest first</option>
              <option value="distanceLongest">Longest first</option>
              <option value="distanceShortest">Shortest first</option>
            </select>
          </div>
        </div>

        <div className={styles.runsWrapper}>
          {finalRunsArray.map((run) => (
            <RunItem
              run={run}
              loading={loading}
              loadingRunId={loadingRunId}
              onDelete={deleteRun}
              isEntering={Boolean(enteringRunIds[run.runId])}
              key={run.runId}
            />
          ))}
        </div>
      </Panel>
      <Link
        href={"/user/runs/new"}
        className={styles.addRunButton}
        aria-label="Add new run"
      >
        {loading === "creatingRun" ? <SpinnerIcon /> : <PlusIcon />}
      </Link>
    </main>
  ) : (
    <Loading />
  );
}
