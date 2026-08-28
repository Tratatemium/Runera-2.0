import styles from "./MyRuns.module.css";
import { icons } from "../../components/icons/icons";

import { useRuns } from "../../hooks/useRuns";
import { useRunsContext } from "../../context/RunsContext";
import { useEffect, useMemo, useRef, useState } from "react";

import { Loading } from "../../components/ui/";
import { RunItem } from "../../components/runs/RunItem";
import { Link } from "react-router-dom";

const { spinner: SpinnerIcon, plus: PlusIcon } = icons;
type SortOption =
  | "startTimeNewest"
  | "startTimeOldest"
  | "distanceLongest"
  | "distanceShortest";

function MyRuns() {
  const { runs, isHydaratingRuns } = useRunsContext();
  const { loading, loadingRunId, deleteRun } = useRuns();
  const [sortBy, setSortBy] = useState<SortOption>("startTimeNewest");
  const [enteringRunIds, setEnteringRunIds] = useState<Record<string, true>>(
    {},
  );
  const prevRunIdsRef = useRef<Set<string>>(new Set());
  const hasInitializedRef = useRef(false);

  const runsArray = useMemo(() => {
    if (!runs) return [];
    return Object.values(runs);
  }, [runs]);

  const sortedRuns = useMemo(() => {
    const nextRuns = [...runsArray];

    switch (sortBy) {
      case "distanceLongest":
        nextRuns.sort((a, b) => b.distanceKm - a.distanceKm);
        break;
      case "distanceShortest":
        nextRuns.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case "startTimeOldest":
        nextRuns.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );
        break;
      default:
        nextRuns.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        );
    }

    return nextRuns;
  }, [runsArray, sortBy]);

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

  return !isHydaratingRuns ? (
    <main className={styles.main}>
      <div className={styles.sortingRow}>
        <label htmlFor="runs-sort" className={styles.sortingLabel}>
          Sort by
        </label>
        <select
          id="runs-sort"
          className={styles.sortingSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="startTimeNewest">Start time (newest first)</option>
          <option value="startTimeOldest">Start time (oldest first)</option>
          <option value="distanceLongest">Distance (longest first)</option>
          <option value="distanceShortest">Distance (shortest first)</option>
        </select>
      </div>
      <div className={styles.runsWrapper}>
        {sortedRuns.map((run) => (
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
      <Link
        to={"/user/runs/new"}
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

export { MyRuns };
