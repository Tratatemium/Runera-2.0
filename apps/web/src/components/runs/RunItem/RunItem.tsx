"use client";

import type { Run } from "@runera/shared";
import type { LoadingState } from "@/hooks";

import { useState } from "react";
import Link from "next/link";

import { icons } from "@/components/icons/icons";
import { Panel, CircleProgress } from "@/components/ui";
import { PaceScale, RunActions } from "@/components/runs";
import { formatDateString } from "@/utils/general.utils";
import { getWeatherPresentation } from "@/utils/runs.utils";
import { filterOptions } from "@/hooks";

import styles from "./RunItem.module.css";

const { calendar: CalendarIcon } = icons.general;
const { clock: ClockIcon, speed: SpeedIcon } = icons.running;

interface RunItemProps {
  run: Run;
  loading: LoadingState;
  loadingRunId: string | null;
  onDelete: (runId: string) => Promise<void>;
  isEntering: boolean;
}

function RunItem({
  run,
  loading,
  loadingRunId,
  onDelete,
  isEntering,
}: RunItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { weatherLabel, WeatherIcon } = getWeatherPresentation(run);

  return (
    <article
      className={styles.article}
      aria-label={`${run.distanceKm} kilometer run`}
    >
      <Link
        href={`/user/runs/${run.runId}`}
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
