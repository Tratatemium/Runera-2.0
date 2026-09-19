"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { icons } from "@/components/icons/icons";
import { Panel, Button, Card } from "@/components/ui";
import {
  PaceScale,
  EffortCircle,
  RunActions,
  SplitsChart,
} from "@/components/runs";
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
  const { runs } = useRunsContext();
  const { loading, loadingRunId, deleteRun } = useRuns();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleBack = () => router.back();

  // Not found
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
    <Panel variant="gradientAccent" className={styles.mainPanel}>
      <header className={styles.header}>
        <Button
          buttonText="Go back"
          variant="transparent"
          onClick={handleBack}
          className={styles.backButton}
        >
          <ArrowBack />
        </Button>
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
        <time dateTime={run.startTime}>
          {formatDateString(run.startTime, "full with time")}
        </time>
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
      <Panel
        variant="onAccent"
        className={`${styles.panel} ${styles.paceAndEffort}`}
      >
        <div className={styles.paceMetric}>
          <PaceScale
            className={styles.paceVSAvg}
            paceSecPerKm={run.paceSecPerKm}
            variant="stretch"
          />
        </div>
        <div className={styles.effortMetric}>
          <EffortCircle perceivedEffort={run.perceivedEffort} />
        </div>
      </Panel>
      <Panel variant="onAccent" className={`${styles.panel} ${styles.splits}`}>
        <SplitsChart run={run} />
      </Panel>
      <Panel variant="onAccent" className={`${styles.panel} ${styles.notes}`}>
        <span className={styles.subTitle}>Notes</span>
        <span className={styles.notesText}>{run.notes ? run.notes : "-"}</span>
      </Panel>
    </Panel>
  );
}

export { RunItemFull };
