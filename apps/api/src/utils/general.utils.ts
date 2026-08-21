import type { Request } from "express";

function getStartOfDay(date: string) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getIdFromReqestParams(req: Request): string {
  return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
}

export { getStartOfDay, getIdFromReqestParams };
