"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { icons } from "@/components/icons/icons";
import { Panel, ButtonLink, Card } from "@/components/ui";
import { PaceScale, EffortCircle } from "@/components/runs";
import { RunActions } from "../RunActions/RunActions";
import { getFieldPresentation } from "@/utils/runs.utils";
import { formatDateString } from "@/utils/general.utils";
import { formatDuration, formatPace } from "@/utils/normalize.utils";

import styles from "./RunItemFull.module.css";

const ArrowBack = icons.general.arrowBack;
interface RunItemFullProps {
  runId: string;
}

function RunItemFull({ runId }: RunItemFullProps) {
  const router = useRouter();
  const { runs, isHydratingRuns } = useRunsContext();
  const { loading, loadingRunId, deleteRun } = useRuns();
  const [isRemoving, setIsRemoving] = useState(false);

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

  const { label: weatherLabel, Icon: WeatherIcon } = getFieldPresentation(
    run,
    "weather",
  );
  const { label: runTypeLabel } = getFieldPresentation(run, "runType");

  const cards = [
    {
      cardLabel: "Distance",
      cardValue: run.distanceKm.toString() ?? "—",
      cardUnit: "km",
    },
    {
      cardLabel: "Duration",
      cardValue: formatDuration(run.durationSec, "human"),
      cardUnit: "",
      type: "duration" as const,
    },
    {
      cardLabel: "Pace",
      cardValue: formatPace(run.paceSecPerKm),
      cardUnit: "min/km",
    },
  ];

  return (
    <Panel variant="gradientAccent" className={styles.panel}>
      <header className={styles.header}>
        <ButtonLink
          linkDirection=""
          linkText="Go back"
          variant="transparent"
          goBack={true}
          className={styles.backButton}
        >
          <ArrowBack />
        </ButtonLink>
        <RunActions
          run={run}
          layout="horizontal"
          loading={loading}
          loadingRunId={loadingRunId}
          onDelete={deleteRun}
          isRemoving={isRemoving}
          setIsRemoving={setIsRemoving}
        />
      </header>

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
        <time>{formatDateString(run.date, "full with time")}</time>
      </div>
      {run.title && <h1 className={styles.runTitle}>{run.title}</h1>}
      <div className={styles.mainStats}>
        {cards.map((card, i) => (
          <Card
            key={card.cardLabel}
            variant="onAccent"
            {...card}
            decorVariant={i}
          />
        ))}
      </div>
      <Panel variant="onAccent" className={styles.paceAndEffort}>
        <PaceScale
          className={styles.paceVSAvg}
          paceSecPerKm={run.paceSecPerKm}
          variant="stretch"
        />
        <EffortCircle perceivedEffort={run.perceivedEffort} />
      </Panel>
    </Panel>
  );
}

export { RunItemFull };
