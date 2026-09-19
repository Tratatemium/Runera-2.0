"use client";

import type { Run } from "@runera/shared";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useElementWidth } from "@/hooks";
import { getScaleColor } from "@/utils/general.utils";
import { formatPace } from "@/utils/normalize.utils";

import styles from "./SplitsChart.module.css";

type Splits = {
  split: string;
  pace: number;
}[];

function generateSplits(n: number, avg: number, div: number): Splits {
  if (n < 1) throw new Error("n must be at least 1");

  const min = avg - div;
  const max = avg + div;

  const values = Array.from(
    { length: n - 1 },
    () => Math.random() * (max - min) + min,
  ).map((value) => Number(value.toFixed(2)));

  const last = Number(
    (n * avg - values.reduce((sum, value) => sum + value, 0)).toFixed(2),
  );

  if (last < min || last > max) {
    return generateSplits(n, avg, div);
  }

  const finalSplits = [...values, last];

  return finalSplits.map((split, i) => {
    return { split: (i + 1).toString(), pace: split };
  });
}

const getSplitColor = (pace: number, min: number, max: number): string =>
  getScaleColor(Math.floor(((max - pace) / (max - min)) * 100));

const getBarHeight = (
  pace: number,
  min: number,
  max: number,
  minHeight: number,
  maxHeight: number,
): number => {
  if (min === max) return maxHeight;

  const normalized = (pace - min) / (max - min);

  return maxHeight - normalized * (maxHeight - minHeight);
};

function getChartData(rawSplits: Splits, minHeight: number, maxHeight: number) {
  const fastestSplit = rawSplits.reduce((fastest, split) =>
    split.pace < fastest.pace ? split : fastest,
  );
  const slowestSplit = rawSplits.reduce((slowest, split) =>
    split.pace > slowest.pace ? split : slowest,
  );
  const min = slowestSplit.pace;
  const max = fastestSplit.pace;

  const splits = rawSplits.map((split) => {
    return {
      ...split,
      color: getSplitColor(split.pace, min, max),
      barHeight: getBarHeight(split.pace, min, max, minHeight, maxHeight),
    };
  });

  return { splits, slowestSplit, fastestSplit };
}

function SplitsChart({ run }: { run: Run }) {
  const fullKm = Math.ceil(run.distanceKm);

  const rawSplits = useMemo(
    () => generateSplits(fullKm, run.paceSecPerKm, 60),
    [fullKm, run.paceSecPerKm],
  );
  const { splits, slowestSplit, fastestSplit } = getChartData(
    rawSplits,
    100,
    20,
  );

  const [chartInnerRef, chartWidth] = useElementWidth<HTMLDivElement>();
  const showLabels = chartWidth / splits.length >= 50;

  return (
    <section className={styles.panel} aria-label="Splits per kilometer">
      <header className={styles.header}>
        <span className={styles.title}>Splits pace (fake)</span>
        <span className={styles.unit}>min/km</span>
      </header>

      <div className={styles.chart}>
        <div
          ref={chartInnerRef}
          className={styles.chartInner}
          style={{ width: `${splits.length * 80}px` }}
        >
          <ResponsiveContainer>
            <BarChart
              data={splits}
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

              <Bar
                dataKey="barHeight"
                name="Pace"
                maxBarSize={72}
                radius={[4, 4, 2, 2]}
              >
                {splits.map(({ split, color }) => (
                  <Cell key={split} fill={color} />
                ))}

                {showLabels && (
                  <LabelList
                    dataKey="pace"
                    position="top"
                    formatter={(pace) => formatPace(Number(pace))}
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
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
