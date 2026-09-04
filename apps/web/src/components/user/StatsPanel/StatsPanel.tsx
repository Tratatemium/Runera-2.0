"use client";

import { useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { Panel, Card } from "@/components/ui";

import styles from "./StatsPanel.module.css";
import { formatSeconds } from "@/utils/normalize.utils";

interface StatsPanelProps {
  type: "stats" | "records";
}

function StatsPanel({ type }: StatsPanelProps) {
  const [period, setPeriod] = useState<"week" | "year" | "allTime">("week");

  const { user } = useAuthContext();
  if (!user) return null;
  const stats = user.stats;

  const cardValues = {
    totalRuns: stats[period].totalRuns?.toString() ?? "—",
    totalDistance: stats[period].totalDistanceMeters
      ? stats[period].totalDistanceMeters.toString()
      : "—",
    totalTime: stats[period].totalTimeSec
      ? formatSeconds(stats[period].totalTimeSec)
      : "—",
    avgPace: stats[period].avgPaceSecPerKm?.toString() ?? "—",
  };

  return (
    <Panel
      variant="frosted"
      className={[styles.statsPanel, styles[type]].filter(Boolean).join(" ")}
    >
      <div className={styles.statsPanelHeader}>
        <h3>Your {type}</h3>
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
      </div>

      {type === "stats" ? (
        <div className={styles.cardsWrapper}>
          <Card
            cardLabel="Total runs"
            cardValue={stats[period].totalRuns?.toString() ?? "—"}
            cardUnit="runs logged"
          ></Card>
          <Card
            cardLabel="Total distance"
            cardValue={stats[period].totalDistanceMeters?.toString() ?? "—"}
            cardUnit="km"
          ></Card>
          <Card
            cardLabel="Total time"
            cardValue={cardValues.totalTime}
            cardUnit=" "
          ></Card>
          <Card
            cardLabel="Average pace"
            cardValue={stats[period].avgPaceSecPerKm?.toString() ?? "—"}
            cardUnit="min/km"
          ></Card>{" "}
        </div>
      ) : (
        <div className={styles.cardsWrapper}>
          <Card
            cardLabel="Total runs"
            cardValue="—"
            cardUnit="runs logged"
          ></Card>
          <Card cardLabel="Total distance" cardValue="—" cardUnit="km"></Card>
          <Card cardLabel="Total time" cardValue="—" cardUnit=" "></Card>
          <Card
            cardLabel="Average pace"
            cardValue="—"
            cardUnit="min/km"
          ></Card>{" "}
        </div>
      )}
    </Panel>
  );
}

export { StatsPanel };
