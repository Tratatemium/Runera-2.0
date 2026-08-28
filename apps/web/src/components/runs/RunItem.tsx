import type { Run } from "../../types/runs.types";
import type { LoadingState } from "../../hooks/useRuns";
import { useEffect, useRef, useState } from "react";

import styles from "./RunItem.module.css";
import { icons } from "../icons/icons";

import { getWeatherIcon } from "../../utils/icons.utils";
import { useDialogContext } from "../../context/DialogContext";
import { Link } from "react-router-dom";

const {
  spinner: SpinnerIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  clock: ClockIcon,
  speed: SpeedIcon,
  calendar: CalendarIcon,
} = icons;

interface RunItemProps {
  run: Run;
  loading: LoadingState;
  loadingRunId: string | null;
  onDelete: (runId: string) => Promise<void>;
  isEntering: boolean;
}

const EXIT_ANIMATION_MS = 360;

const weatherLabelMap: Record<NonNullable<Run["weather"]>, string> = {
  sunny: "Sunny",
  partly_cloudy: "Partly cloudy",
  cloudy: "Cloudy",
  rain: "Rain",
  snow: "Snow",
  windy: "Windy",
  hot: "Hot",
  cold: "Cold",
};

function RunItem({
  run,
  loading,
  loadingRunId,
  onDelete,
  isEntering,
}: RunItemProps) {
  const { openDialog } = useDialogContext();
  const [isRemoving, setIsRemoving] = useState(false);
  const deleteTimeoutRef = useRef<number | null>(null);
  const weatherLabel = run.weather ? weatherLabelMap[run.weather] : null;

  useEffect(
    () => () => {
      if (deleteTimeoutRef.current) {
        window.clearTimeout(deleteTimeoutRef.current);
      }
    },
    [],
  );

  function handleDelete() {
    if (isRemoving) {
      return;
    }

    openDialog({
      title: "Delete Run",
      text: "Are you sure you want to delete this run?",
      action1Text: "No",
      onAction1: () => {},
      action2Text: "Yes",
      onAction2: () => {
        setIsRemoving(true);
        deleteTimeoutRef.current = window.setTimeout(() => {
          void onDelete(run.runId);
        }, EXIT_ANIMATION_MS);
      },
    });
  }

  const isDeletingCurrentRun =
    loading === "deletingRun" && loadingRunId === run.runId;
  const disableActions = isRemoving || isDeletingCurrentRun;

  return (
    <article
      className={`${styles.runWrapper} ${isEntering ? styles.runWrapperEntering : ""} ${isRemoving ? styles.runWrapperRemoving : ""}`}
      aria-label={`${run.distanceKm} kilometer run`}
    >
      <div className={styles.runInfo}>
        <div className={styles.runHeading}>
          <h2 className={styles.distanceKm}>{`${run.distanceKm} km`}</h2>
          {run.title && <p className={styles.runTitle}>{run.title}</p>}
        </div>
        <p className={styles.timing}>
          <span className={styles.duration}>
            <ClockIcon aria-hidden="true" focusable="false" />
            {run.formattedDuration}
          </span>
          <span aria-hidden="true">•</span>
          <span className={styles.pace}>
            <SpeedIcon aria-hidden="true" focusable="false" />
            {run.formattedPace}
          </span>
        </p>
        <p className={styles.circumstances}>
          <time className={styles.date} dateTime={run.startTime}>
            <CalendarIcon aria-hidden="true" focusable="false" />
            {run.date}
          </time>
          {run.weather && (
            <span
              className={styles.weather}
              aria-label={weatherLabel ?? undefined}
            >
              {getWeatherIcon(run.weather, {
                "aria-hidden": true,
                focusable: "false",
              })}
            </span>
          )}
        </p>
      </div>
      <div className={styles.runActions} aria-label="Run actions">
        <button
          className={styles.actionButton}
          type="button"
          onClick={handleDelete}
          disabled={disableActions}
          aria-label={`Delete ${run.distanceKm} kilometer run from ${run.date}`}
          title="Delete run"
        >
          {isDeletingCurrentRun ? (
            <SpinnerIcon aria-hidden="true" focusable="false" />
          ) : (
            <DeleteIcon aria-hidden="true" focusable="false" />
          )}
        </button>
        <Link
          to={`${run.runId}/edit`}
          className={styles.actionButton}
          aria-label={`Edit ${run.distanceKm} kilometer run from ${run.date}`}
          title="Edit run"
        >
          {loading === "updatingRun" && loadingRunId === run.runId ? (
            <SpinnerIcon aria-hidden="true" focusable="false" />
          ) : (
            <EditIcon aria-hidden="true" focusable="false" />
          )}
        </Link>
      </div>
    </article>
  );
}

export { RunItem };
