"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { useRunsContext } from "@/context/RunsContext";
import { Panel } from "@/components/ui";
import { CalendarDayButton } from "./CalendarDayButton/CalendarDayButton";

import styles from "./Calendar.module.css";

function Calendar() {
  const { getRunsByDate } = useRunsContext();

  const [selctedDay, setSelectedDay] = useState<Date | null>(null);
  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    if (selctedDay) {
      console.log(date);
      console.log(getRunsByDate(date));
    }
  };

  return (
    <Panel variant="frostedAccent" className={styles.panel}>
      <h2 className={styles.heading}>Running calendar</h2>
      <DayPicker
        mode="single"
        weekStartsOn={1}
        components={{ DayButton: CalendarDayButton }}
        onDayClick={handleDayClick}
      />
      {selctedDay && getRunsByDate(selctedDay)?.length}
      {/* {selctedDay &&
    getRunsByDate(selctedDay)
        ?.map((run) => JSON.stringify(run))
        .join(", ")} */}
    </Panel>
  );
}

export { Calendar };
