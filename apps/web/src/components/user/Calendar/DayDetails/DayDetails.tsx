"use client";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { WindowControls } from "@/components/ui";
import { RunItem } from "@/components/runs";
import {
  formatDateString,
  toDateOnlyString,
  pluralize,
} from "@/utils/general.utils";
import { formatDuration, formatDistance } from "@/utils/normalize.utils";

import styles from "./DayDetails.module.css";

interface DayDetailsProps {
  date: Date;
  onClose: () => void;
}

function DayDetails({ date, onClose }: DayDetailsProps) {
  const { getRunsByDate } = useRunsContext();
  const { loading, loadingRunId, deleteRun } = useRuns();
  const runs = getRunsByDate(date);
  const runsAmount = runs ? runs.length : "—";
  const totalDistance = runs
    ? formatDistance(runs?.reduce((acc, run) => acc + run.distanceMeters, 0))
    : "—";
  const totalDuration = runs
    ? formatDuration(
        runs?.reduce((acc, run) => acc + run.durationSec, 0),
        "human",
      )
    : "—";

  return (
    <div
      className={styles.details}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${date.toDateString()}`}
    >
      <WindowControls
        variant="close"
        aria-label="Close day details"
        onClick={onClose}
      />

      <header className={styles.header}>
        <h1 className={styles.title}>Running Day</h1>
        <time
          className={styles.date}
        >{`${formatDateString(toDateOnlyString(date), "full with weekday")}`}</time>

        <div className={styles.statsWrapper}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total distance</span>
            <span className={styles.statValue}>
              <span>{totalDistance}</span>
              {runs && <span className={styles.statUnit}>km</span>}
            </span>
          </div>

          <span className={styles.separatorLine} />

          <div className={styles.stat}>
            <span className={styles.statLabel}>Total duration</span>
            <span className={styles.statValue}>
              {totalDuration.split(/(\s?[hms]\b)/).map((part, index) =>
                /[hms]\b/.test(part) ? (
                  <span className={styles.statUnit} key={index}>
                    {` ${part}`}
                  </span>
                ) : (
                  part
                ),
              )}
            </span>
          </div>

          <span className={styles.separatorLine} />

          <div className={styles.stat}>
            <span className={styles.statLabel}>
              {pluralize("Run", runs ? runs.length : 0)}
            </span>
            <span className={styles.statValue}>
              <span>{runsAmount}</span>
            </span>
          </div>
        </div>
      </header>

      {runs && (
        <div className={styles.runsWrapper}>
          {runs.map((run) => (
            <RunItem
              run={run}
              variant="short"
              loading={loading}
              loadingRunId={loadingRunId}
              onDelete={deleteRun}
              isEntering={false}
              key={run.runId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { DayDetails };
export type { DayDetailsProps };
