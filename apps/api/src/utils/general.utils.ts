import type { Request } from "express";

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

export { getStartOfDay, getIdFromRequestParams, getTimeIntervals };
