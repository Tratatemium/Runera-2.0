"use client";

import { useState } from "react";

import { icons } from "@/components/icons/icons";
import { useAuthContext } from "@/context/AuthContext";
import { Panel, Card } from "@/components/ui";

import styles from "./StatsPanel.module.css";
import {
  formatDuration,
  formatDistance,
  formatPace,
  normalizeDate,
} from "@/utils/normalize.utils";
import { hasKey } from "@/utils/general.utils";

const {
  number1: Icon1k,
  number5: Icon5k,
  number10: Icon10k,
  number21: Icon21k,
  number42: Icon42k,
  distance: DistanceIcon,
  speed: SpeedIcon,
  time: TimeIcon,
} = icons.records;
interface StatsPanelProps {
  type: "stats" | "records" | "shortStats";
}

function StatsPanel({ type }: StatsPanelProps) {
  const [period, setPeriod] = useState<"week" | "year" | "allTime">("week");

  const { user } = useAuthContext();
  if (!user) return null;
  const stats = user.stats;

  const runDistances = [
    { label: "1k", icon: Icon1k },
    { label: "5k", icon: Icon5k },
    { label: "10k", icon: Icon10k },
    { label: "halfMarathon", icon: Icon21k },
    { label: "marathon", icon: Icon42k },
  ] as const;

  const cards = {
    stats: [
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
    ],
    shortStats: [
      {
        cardLabel: "Total runs",
        cardValue: stats.allTime.totalRuns?.toString() ?? "—",
        cardUnit: "",
      },
      {
        cardLabel: "Total distance",
        cardValue: stats.allTime.totalDistanceMeters
          ? formatDistance(stats.allTime.totalDistanceMeters)
          : "—",
        cardUnit: stats.allTime.totalDistanceMeters ? "km" : "",
      },
      {
        cardLabel: "Average pace",
        cardValue: stats.allTime.avgPaceSecPerKm
          ? formatPace(stats.allTime.avgPaceSecPerKm)
          : "—",
        cardUnit: stats.allTime.avgPaceSecPerKm ? "min/km" : "",
      },
    ],
    records: [
      {
        cardLabel: "Longest distance",
        cardDate: stats.records.longestRun?.date
          ? normalizeDate(stats.records.longestRun.date)
          : "",
        cardValue: stats.records.longestRun
          ? formatDistance(stats.records.longestRun.distanceMeters)
          : "—",
        cardUnit: stats.records.longestRun ? "km" : "",
        icon: DistanceIcon,
      },
      {
        cardLabel: "Longest duration",
        cardDate: stats.records.longestRunDuration?.date
          ? normalizeDate(stats.records.longestRunDuration.date)
          : "",
        cardValue: stats.records.longestRunDuration
          ? formatDuration(
              stats.records.longestRunDuration.durationSec,
              "human",
            )
          : "—",
        cardUnit: " ",
        type: "duration" as const,
        icon: TimeIcon,
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
        icon: SpeedIcon,
      },
      ...runDistances.flatMap((el) => {
        const record = stats.records[el.label];

        return record
          ? [
              {
                cardLabel: `Best ${el.label}`,
                cardDate: record.date ? normalizeDate(record.date) : "",
                cardValue: formatPace(record.paceSecPerKm),
                cardUnit: "min/km",
                icon: el.icon,
              },
            ]
          : [];
      }),
    ],
  } as const;

  if (!hasKey(cards, type))
    throw new Error(
      `type must be one of "${Object.keys(cards).join(", ")}", got "${type}"`,
    );

  const isPanelType = ["stats", "records"].includes(type);
  const content = (
    <>
      {isPanelType && (
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
      )}

      <div className={styles[`${type}Wrapper`]}>
        {cards[type].map((card, i) => (
          <Card key={card.cardLabel} {...card} decorVariant={i} />
        ))}
      </div>
    </>
  );

  return isPanelType ? (
    <Panel
      variant="frostedAccent"
      className={[styles.statsPanel, styles[type]].filter(Boolean).join(" ")}
    >
      {content}
    </Panel>
  ) : (
    <div
      className={[styles.emptyWrapper, styles[type]].filter(Boolean).join(" ")}
    >
      {content}
    </div>
  );
}

export { StatsPanel };
