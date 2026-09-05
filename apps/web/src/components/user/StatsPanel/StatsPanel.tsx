"use client";

import { useState } from "react";

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
      cardUnit: "km",
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
      cardUnit: "min/km",
    },
  ];

  const runDistances = ["1k", "5k", "10k", "halfMarathon", "marathon"] as const;

  const recordsCards = [
    {
      cardLabel: "Longest distance",
      cardDate: stats.records.longestRun?.date
        ? normalizeDate(stats.records.longestRun.date)
        : "",
      cardValue: stats.records.longestRun
        ? formatDistance(stats.records.longestRun.distanceMeters)
        : "—",
      cardUnit: "km",
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
    },
    {
      cardLabel: "Best pace",
      cardDate: stats.records.fastestPace?.date
        ? normalizeDate(stats.records.fastestPace.date)
        : "",
      cardValue: stats.records.fastestPace
        ? formatPace(stats.records.fastestPace.paceSecPerKm)
        : "—",
      cardUnit: "min/km",
    },
    ...runDistances.map(
      (el) =>
        stats.records[el] && {
          cardLabel: `Best ${el}`,
          cardDate: stats.records[el]?.date
            ? normalizeDate(stats.records[el].date)
            : "",
          cardValue: stats.records[el]
            ? formatPace(stats.records[el].paceSecPerKm)
            : "—",
          cardUnit: "min/km",
        },
    ),
  ];

  return (
    <Panel
      variant="frosted"
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
          {statsCards.map((card) => (
            <Card key={card.cardLabel} {...card} />
          ))}
        </div>
      ) : (
        <div className={styles.recordsWrapper}>
          {recordsCards.map(
            (card) => card && <Card key={card.cardLabel} {...card} />,
          )}
        </div>
      )}
    </Panel>
  );
}

export { StatsPanel };
