"use client";

import type { DayButtonProps } from "react-day-picker";

import { FaRunning } from "react-icons/fa";

import { useRunsContext } from "@/context/RunsContext";

import styles from "./CalendarDayButton.module.css";

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
          <FaRunning className={styles.icon} />
        </span>
      )}
    </button>
  );
}

export { CalendarDayButton };
