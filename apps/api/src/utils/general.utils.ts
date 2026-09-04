import type { Request } from "express";
import type { UserStatsResponse } from "@runera/shared";
import type { DBRun } from "../models/runs.models.js";
import type {
  AggregatedStats,
  AggregatedPeriodStats,
} from "../repositories/users.repository.js";

import { startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns";

function getStartOfDay(date: string) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getIdFromRequestParams(req: Request): string {
  return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
}

function getTimeIntervals() {
  const now = Date.now();
  return {
    weekStart: startOfWeek(now, { weekStartsOn: 1 }),
    weekEnd: endOfWeek(now, { weekStartsOn: 1 }),
    yearStart: startOfYear(now),
    yearEnd: endOfYear(now),
  };
}

function normalizePeriod(period: [] | AggregatedPeriodStats[]) {
  const emptyPeriod = {
    totalRuns: null,
    totalTimeSec: null,
    totalDistanceMeters: null,
    avgPaceSecPerKm: null,
  };

  if (period.length === 0) return emptyPeriod;
  else
    return {
      ...period[0],
      avgPaceSecPerKm:
        period[0].totalTimeSec / (period[0].totalDistanceMeters / 1000),
    };
}

function normalizeRecord(fastest: [] | DBRun[]) {
  if (fastest.length === 0) return null;
  const { runId, durationSec, distanceMeters, paceSecPerKm, date } = fastest[0];
  return {
    runId,
    durationSec,
    distanceMeters,
    paceSecPerKm,
    date: date.toISOString(),
  };
}

function normalizeStats(rawStats: AggregatedStats): UserStatsResponse {
  const result = {
    week: normalizePeriod(rawStats.week),
    year: normalizePeriod(rawStats.year),
    allTime: normalizePeriod(rawStats.allTime),
    records: {
      longestRun: normalizeRecord(rawStats.longestRun),
      longestRunDuration: normalizeRecord(rawStats.longestRunDuration),
      fastestPace: normalizeRecord(rawStats.fastestPace),
      "1k": normalizeRecord(rawStats["1k"]),
      "5k": normalizeRecord(rawStats["5k"]),
      "10k": normalizeRecord(rawStats["10k"]),
      halfMarathon: normalizeRecord(rawStats.halfMarathon),
      marathon: normalizeRecord(rawStats.marathon),
    },
  };
  return result;
}

export {
  getStartOfDay,
  getIdFromRequestParams,
  getTimeIntervals,
  normalizeStats,
};
