"use client";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { WindowControls } from "@/components/ui";
import { RunItem } from "@/components/runs";

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
      <span>{`daily details ${date.toDateString()}`}</span>
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
