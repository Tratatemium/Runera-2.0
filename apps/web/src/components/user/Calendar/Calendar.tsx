"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { useRunsContext } from "@/context/RunsContext";
import { useDialogContext } from "@/context/DialogContext";
import { icons } from "@/components/icons/icons";
import { Panel } from "@/components/ui";
import { CalendarDayButton } from "./CalendarDayButton/CalendarDayButton";

import styles from "./Calendar.module.css";

const CircleIcon = icons.general.circle;

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
  const handleDayClick = useCallback(
    (date: Date) => {
      setSelectedDay(date);
      openDayDetailsDialog({ date });
    },
    [openDayDetailsDialog],
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const prevOpenedDate = searchParams.get("date");
  const handledDateRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevOpenedDate && handledDateRef.current !== prevOpenedDate) {
      handledDateRef.current = prevOpenedDate;
      handleDayClick(new Date(prevOpenedDate));
      window.history.replaceState({}, "", pathname);
    }
  }, [prevOpenedDate, handleDayClick, pathname]);

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
              <CircleIcon className={styles.legendIcon} />
              {item.text}
            </span>
          ))}
        </div>
      </Panel>
    </>
  );
}

export { Calendar };
