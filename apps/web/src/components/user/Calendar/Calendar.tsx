"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { useDialogContext } from "@/context/DialogContext";
import { icons } from "@/components/icons/icons";
import { Panel } from "@/components/ui";
import { CalendarDayButton } from "./CalendarDayButton/CalendarDayButton";
import { toDateOnlyString } from "@/utils/general.utils";

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
  const router = useRouter();
  const { openDayDetailsDialog } = useDialogContext();

  const handleDayClick = useCallback(
    (date: Date) => {
      router.push(`/user/dashboard?date=${toDateOnlyString(date)}`, {
        scroll: false,
      });

      openDayDetailsDialog({ date });
    },
    [openDayDetailsDialog, router],
  );

  const searchParams = useSearchParams();
  const openedDate = searchParams.get("date");

  useEffect(() => {
    if (!openedDate) return;

    openDayDetailsDialog({
      date: new Date(`${openedDate}T00:00:00`),
    });
  }, [openedDate, openDayDetailsDialog]);

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
