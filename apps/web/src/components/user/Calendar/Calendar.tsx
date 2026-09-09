"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { Panel } from "@/components/ui";
import { CalendarDayButton } from "./CalendarDayButton/CalendarDayButton";

import styles from "./Calendar.module.css";

function Calendar() {
  const [selctedDay, setSelectedDay] = useState<Date | null>(null);
  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
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
      {selctedDay && selctedDay.toISOString()}
    </Panel>
  );
}

export { Calendar };
