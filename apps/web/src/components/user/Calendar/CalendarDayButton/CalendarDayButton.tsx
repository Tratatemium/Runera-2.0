"use client";

import type { DayButtonProps } from "react-day-picker";

import { icons } from "@/components/icons/icons";
import { useRunsContext } from "@/context/RunsContext";

import styles from "./CalendarDayButton.module.css";

const RunIcon = icons.running.run;

function CalendarDayButton(props: DayButtonProps) {
  const { day, modifiers: _, ...buttonProps } = props;
  const date = day.date;

  const { getRunsByDate } = useRunsContext();
  const runs = getRunsByDate(date);
  const totalDistance = runs?.reduce((total, run) => total + run.distanceKm, 0);

  return (
    <button
      {...buttonProps}
      className={`${styles.day} ${runs ? styles.hasRuns : ""}`}
    >
      <span className={styles.date}>{date.getDate()}</span>
      {runs && (
        <span className={styles.infoWrapper}>
          <span className={styles.info}>{`${totalDistance} km`}</span>
          <RunIcon className={styles.icon} />
        </span>
      )}
    </button>
  );
}

export { CalendarDayButton };
