"use client";

import { useState } from "react";
import {
  TbNumber1Small,
  TbNumber5Small,
  TbNumber10Small,
  TbNumber21Small,
  TbNumber42Small,
} from "react-icons/tb";
import { GiPathDistance, GiSpeedometer } from "react-icons/gi";
import { FiClock } from "react-icons/fi";

import { useAuthContext } from "@/context/AuthContext";
import { Panel, Card } from "@/components/ui";

import styles from "./StatsPanel.module.css";
import {
  formatDuration,
  formatDistance,
  formatPace,
  normalizeDate,
} from "@/utils/normalize.utils";

interface StatsPanelProps {
  type: "stats" | "records";
}

function StatsPanel({ type }: StatsPanelProps) {
  const [period, setPeriod] = useState<"week" | "year" | "allTime">("week");

  const { user } = useAuthContext();
  if (!user) return null;
  const stats = user.stats;

  const statsCards = [
    {
      cardLabel: "Total runs",
      cardValue: stats[period].totalRuns?.toString() ?? "—",
      cardUnit: "",
    },
    {
      cardLabel: "Total distance",
      cardValue: stats[period].totalDistanceMeters
        ? formatDistance(stats[period].totalDistanceMeters)
        : "—",
      cardUnit: stats[period].totalDistanceMeters ? "km" : "",
    },
    {
      cardLabel: "Total time",
      cardValue: stats[period].totalTimeSec
        ? formatDuration(stats[period].totalTimeSec, "human")
        : "—",
      cardUnit: "",
      type: "duration" as const,
    },
    {
      cardLabel: "Average pace",
      cardValue: stats[period].avgPaceSecPerKm
        ? formatPace(stats[period].avgPaceSecPerKm)
        : "—",
      cardUnit: stats[period].avgPaceSecPerKm ? "min/km" : "",
    },
  ];

  const runDistances = [
    { label: "1k", icon: TbNumber1Small },
    { label: "5k", icon: TbNumber5Small },
    { label: "10k", icon: TbNumber10Small },
    { label: "halfMarathon", icon: TbNumber21Small },
    { label: "marathon", icon: TbNumber42Small },
  ] as const;

  const recordsCards = [
    {
      cardLabel: "Longest distance",
      cardDate: stats.records.longestRun?.date
        ? normalizeDate(stats.records.longestRun.date)
        : "",
      cardValue: stats.records.longestRun
        ? formatDistance(stats.records.longestRun.distanceMeters)
        : "—",
      cardUnit: stats.records.longestRun ? "km" : "",
      icon: GiPathDistance,
    },
    {
      cardLabel: "Longest duration",
      cardDate: stats.records.longestRunDuration?.date
        ? normalizeDate(stats.records.longestRunDuration.date)
        : "",
      cardValue: stats.records.longestRunDuration
        ? formatDuration(stats.records.longestRunDuration.durationSec, "human")
        : "—",
      cardUnit: " ",
      type: "duration" as const,
      icon: FiClock,
    },
    {
      cardLabel: "Best pace",
      cardDate: stats.records.fastestPace?.date
        ? normalizeDate(stats.records.fastestPace.date)
        : "",
      cardValue: stats.records.fastestPace
        ? formatPace(stats.records.fastestPace.paceSecPerKm)
        : "—",
      cardUnit: stats.records.fastestPace ? "min/km" : "",
      icon: GiSpeedometer,
    },
    ...runDistances.map((el) => {
      const record = stats.records[el.label];

      return (
        record && {
          cardLabel: `Best ${el.label}`,
          cardDate: record.date ? normalizeDate(record.date) : "",
          cardValue: formatPace(record.paceSecPerKm),
          cardUnit: "min/km",
          icon: el.icon,
        }
      );
    }),
  ];

  return (
    <Panel
      variant="frostedAccent"
      className={[styles.statsPanel, styles[type]].filter(Boolean).join(" ")}
    >
      <div className={styles.statsPanelHeader}>
        <h3>Your {type}</h3>
        {type === "stats" && (
          <div className={styles.periodSwitch}>
            <button
              className={period === "week" ? styles.active : ""}
              onClick={() => setPeriod("week")}
            >
              This week
            </button>

            <button
              className={period === "year" ? styles.active : ""}
              onClick={() => setPeriod("year")}
            >
              This year
            </button>

            <button
              className={period === "allTime" ? styles.active : ""}
              onClick={() => setPeriod("allTime")}
            >
              All time
            </button>
          </div>
        )}
      </div>

      {type === "stats" ? (
        <div className={styles.statsWrapper}>
          {statsCards.map((card, i) => (
            <Card key={card.cardLabel} {...card} decorVariant={i} />
          ))}
        </div>
      ) : (
        <div className={styles.recordsWrapper}>
          {recordsCards.map(
            (card, i) =>
              card && <Card key={card.cardLabel} {...card} decorVariant={i} />,
          )}
        </div>
      )}
    </Panel>
  );
}

export { StatsPanel };
