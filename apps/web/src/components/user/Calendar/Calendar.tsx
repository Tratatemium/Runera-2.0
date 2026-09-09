"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { Panel } from "@/components/ui";
import { CalendarDayButton } from "./CalendarDayButton";

import styles from "./Calendar.module.css";

function Calendar() {
  return (
    <Panel variant="frostedAccent" className={styles.panel}>
      <h2 className={styles.heading}>Running calendar</h2>
      <DayPicker
        mode="single"
        weekStartsOn={1}
        components={{ DayButton: CalendarDayButton }}
      />
    </Panel>
  );
}

export { Calendar };
