"use client";

import type { Run } from "@runera/shared";
import type { LoadingState } from "@/hooks";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { icons } from "@/components/icons/icons";
import { Panel, CircleProgress } from "@/components/ui";
import { PaceScale } from "../PaceScale/PaceScale";
import { useDialogContext } from "@/context/DialogContext";
import { formatDateString } from "@/utils/general.utils";
import { filterOptions } from "@/hooks";

import styles from "./RunItem.module.css";

const {
  delete: DeleteIcon,
  edit: EditIcon,
  calendar: CalendarIcon,
} = icons.general;
const { clock: ClockIcon, speed: SpeedIcon } = icons.running;
const SpinnerIcon = icons.spinners.spinner;

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
  partlyCloudy: "Partly cloudy",
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
  const { openConfirmDialog } = useDialogContext();
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

    openConfirmDialog({
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

  const WeatherIcon = run.weather ? icons.weather[run.weather] : null;

  return (
    <article
      className={styles.article}
      aria-label={`${run.distanceKm} kilometer run`}
    >
      <Panel
        variant="gradientAccent"
        className={[
          styles.runWrapper,
          isEntering ? styles.runWrapperEntering : undefined,
          isRemoving ? styles.runWrapperRemoving : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.runInfo}>
          <div className={styles.runHeading}>
            {run.runType && (
              <span className={`${styles.runType} ${styles[run.runType]}`}>
                {filterOptions.find((el) => el.name === run.runType)?.label}
              </span>
            )}
            {run.weather && WeatherIcon && (
              <span
                className={styles.weather}
                aria-label={weatherLabel ?? undefined}
              >
                <WeatherIcon
                  className={styles.weatherIcon}
                  aria-hidden="true"
                  focusable="false"
                />
              </span>
            )}
            {run.title && <span className={styles.runTitle}>{run.title}</span>}
          </div>

          <h2 className={styles.distanceKm}>
            {run.distanceKm}
            <span className={styles.distanceUnit}>{` km`}</span>
          </h2>

          <div className={styles.circumstances}>
            <span className={styles.duration}>
              <ClockIcon aria-hidden="true" focusable="false" />
              {run.formattedDuration}
            </span>
            <span aria-hidden="true">•</span>
            <span className={styles.pace}>
              <SpeedIcon aria-hidden="true" focusable="false" />
              {run.formattedPace}
            </span>
            <span aria-hidden="true">•</span>
            <time className={styles.date} dateTime={run.startTime}>
              <CalendarIcon aria-hidden="true" focusable="false" />
              {formatDateString(run.date)}
            </time>
          </div>
        </div>

        <div className={styles.runGraphs}>
          <span className={styles.separatorLine} />

          <PaceScale
            className={styles.paceVSAvg}
            paceSecPerKm={run.paceSecPerKm}
          />

          <span className={styles.separatorLine} />

          <div className={styles.effortWrapper}>
            {run.perceivedEffort ? (
              <CircleProgress
                className={styles.effortCircle}
                radius={25}
                percentage={run.perceivedEffort * 10}
                showNumber={"decimal"}
              />
            ) : (
              <span className={styles.effortPlaceholder}>-</span>
            )}
            <span>Effort</span>
          </div>

          <span className={styles.separatorLine} />

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
              href={`/user/runs/${run.runId}/edit`}
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
        </div>
      </Panel>
    </article>
  );
}

export { RunItem };
