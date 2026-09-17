"use client";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { WindowControls } from "@/components/ui";
import { RunItem } from "@/components/runs";
import { formatDateString, toDateOnlyString } from "@/utils/general.utils";

import styles from "./DayDetails.module.css";

interface DayDetailsProps {
  date: Date;
  onClose: () => void;
}

function DayDetails({ date, onClose }: DayDetailsProps) {
  const { getRunsByDate } = useRunsContext();
  const { loading, loadingRunId, deleteRun } = useRuns();
  const runs = getRunsByDate(date);

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
