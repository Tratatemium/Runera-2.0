"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useRunsContext } from "@/context/RunsContext";
import { useRuns } from "@/hooks";
import { Panel, ButtonLink } from "@/components/ui";
import { RunActions } from "../RunActions/RunActions";
import { getWeatherPresentation } from "@/utils/runs.utils";

import styles from "./RunItemFull.module.css";

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

  const { weatherLabel, WeatherIcon } = getWeatherPresentation(run);

  return (
    <Panel variant="gradientAccent" className={styles.panel}>
      <header className={styles.header}>
        <ButtonLink
          linkDirection=""
          linkText="← Go back"
          variant="transparent"
          goBack={true}
          className={styles.backButton}
        />
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

      <div>
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
      </div>
    </Panel>
  );
}

export { RunItemFull };
