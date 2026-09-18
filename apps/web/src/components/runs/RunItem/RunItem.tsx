"use client";

import type { Run } from "@runera/shared";
import type { LoadingState } from "@/hooks";

import { useState } from "react";
import Link from "next/link";
import { assertAllowed } from "@runera/shared";

import { icons } from "@/components/icons/icons";
import { Panel } from "@/components/ui";
import { EffortCircle, PaceScale, RunActions } from "@/components/runs";
import { formatDateString } from "@/utils/general.utils";
import { getFieldPresentation } from "@/utils/runs.utils";

import styles from "./RunItem.module.css";

const { calendar: CalendarIcon } = icons.general;
const { clock: ClockIcon, speed: SpeedIcon } = icons.running;

interface RunItemProps {
  run: Run;
  variant: "full" | "short";
  loading: LoadingState;
  loadingRunId: string | null;
  onDelete: (runId: string) => Promise<void>;
  isEntering: boolean;
  from: "runs" | "day-details";
  date?: string;
}

function RunItem({
  run,
  variant,
  loading,
  loadingRunId,
  onDelete,
  isEntering,
  from,
  date,
}: RunItemProps) {
  assertAllowed(variant, "variant", ["full", "short"]);
  const [isRemoving, setIsRemoving] = useState(false);
  const { label: weatherLabel, Icon: WeatherIcon } = getFieldPresentation(
    run,
    "weather",
  );
  const { label: runTypeLabel } = getFieldPresentation(run, "runType");

  return (
    <article
      className={styles.article}
      aria-label={`${run.distanceKm} kilometer run`}
    >
      <Link
        href={`/user/runs/${run.runId}?from=${from}${date ? `&date=${date}` : ""}`}
        className={styles.link}
        aria-label={`View details for ${run.distanceKm} kilometer run`}
      />
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
                {runTypeLabel}
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
              {formatDateString(run.date, "short")}
            </time>
          </div>
        </div>

        <div className={styles.runGraphs}>
          {variant === "full" && (
            <>
              <span className={styles.separatorLine} />

              <PaceScale
                className={styles.paceVSAvg}
                paceSecPerKm={run.paceSecPerKm}
                variant="short"
              />

              <span className={styles.separatorLine} />

              <EffortCircle perceivedEffort={run.perceivedEffort} />
            </>
          )}
          <span className={styles.separatorLine} />
          <RunActions
            run={run}
            layout="vertical"
            loading={loading}
            loadingRunId={loadingRunId}
            onDelete={onDelete}
            isRemoving={isRemoving}
            setIsRemoving={setIsRemoving}
          />
        </div>
      </Panel>
    </article>
  );
}

export { RunItem };
