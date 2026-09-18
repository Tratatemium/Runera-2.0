"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./SplitsChart.module.css";

const splits = [
  { split: "1", pace: 5.2, color: "#5dcaa5" },
  { split: "2", pace: 5.0, color: "#5dcaa5" },
  { split: "3", pace: 5.4, color: "#9dddc9" },
  { split: "4", pace: 4.9, color: "#9dddc9" },
  { split: "5", pace: 5.1, color: "#f9c56d" },
  { split: "6", pace: 5.15, color: "#f9c56d" },
  { split: "7", pace: 5.12, color: "#f9c56d" },
  { split: "8", pace: 5.32, color: "#f0997b" },
  { split: "9", pace: 5.36, color: "#f0997b" },
  { split: "10", pace: 5.3, color: "#f0997b" },
  { split: "11", pace: 5.44, color: "#ed4848" },
  { split: "12", pace: 5.42, color: "#ed4848" },
];

const slowestPace = Math.max(...splits.map(({ pace }) => pace));
const chartData = splits.map((split) => ({
  ...split,
  barHeight: slowestPace - split.pace + 0.4,
}));

function formatPace(pace: number) {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const fastestSplit = splits.reduce((fastest, split) =>
  split.pace < fastest.pace ? split : fastest,
);
const slowestSplit = splits.reduce((slowest, split) =>
  split.pace > slowest.pace ? split : slowest,
);

function SplitsChart() {
  return (
    <section className={styles.panel} aria-label="Splits per kilometer">
      <header className={styles.header}>
        <span className={styles.title}>Splits per km</span>
        <span className={styles.unit}>min/km</span>
      </header>
      <div className={styles.chart}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="split" axisLine={false} tickLine={false} />
            <Tooltip
              cursor={false}
              formatter={(_, __, item) =>
                `${formatPace(item.payload.pace)} min/km`
              }
              labelFormatter={(label) => `Kilometer ${label}`}
            />
            <Bar dataKey="barHeight" radius={[4, 4, 2, 2]}>
              {chartData.map(({ split, color }) => (
                <Cell key={split} fill={color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className={styles.summary}>
        Bar height = faster pace. Fastest: {fastestSplit.split} (
        {formatPace(fastestSplit.pace)}/km)
        <span aria-hidden="true"> · </span>
        Slowest: {slowestSplit.split} ({formatPace(slowestSplit.pace)}/km)
      </p>
    </section>
  );
}

export { SplitsChart };
