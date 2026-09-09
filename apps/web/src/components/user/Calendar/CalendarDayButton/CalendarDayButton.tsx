"use client";

import type { DayButtonProps } from "react-day-picker";

import styles from "./CalendarDayButton.module.css";

function CalendarDayButton(props: DayButtonProps) {
  const { day, ...buttonProps } = props;
  const date = day.date;

  return (
    <button {...buttonProps} className={styles.day}>
      <span className={styles.date}>{date.getDate()}</span>
    </button>
  );
}

export { CalendarDayButton };
