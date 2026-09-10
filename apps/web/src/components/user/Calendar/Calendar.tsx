"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { FaCircle } from "react-icons/fa";

import { useRunsContext } from "@/context/RunsContext";
import { useDialogContext } from "@/context/DialogContext";
import { Panel } from "@/components/ui";
import { CalendarDayButton } from "./CalendarDayButton/CalendarDayButton";

import styles from "./Calendar.module.css";

const legendItems = [
  {
    text: "Logged run",
    class: "legendLogged",
  },
  {
    text: "Planned run",
    class: "legendPlanned",
  },
  {
    text: "Today",
    class: "legendToday",
  },
];

function Calendar() {
  const { getRunsByDate } = useRunsContext();
  const { openDayDetailsDialog } = useDialogContext();

  const [selctedDay, setSelectedDay] = useState<Date | null>(null);
  function handleDayClick(date: Date) {
    setSelectedDay(date);
    openDayDetailsDialog({ date });
  }

  return (
    <>
      <Panel variant="frostedAccent" className={styles.panel}>
        <h2 className={styles.heading}>Running calendar</h2>
        <DayPicker
          mode="single"
          weekStartsOn={1}
          components={{ DayButton: CalendarDayButton }}
          onDayClick={handleDayClick}
        />
        <div className={styles.legend}>
          {legendItems.map((item) => (
            <span
              className={`${styles.legendItem} ${styles[item.class]}`}
              key={item.class}
            >
              <FaCircle className={styles.legendIcon} />
              {item.text}
            </span>
          ))}
        </div>
      </Panel>
    </>
  );
}

export { Calendar };
