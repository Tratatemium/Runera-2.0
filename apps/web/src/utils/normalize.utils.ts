import type { InputFieldConfig } from "../types/forms.types";

/* ────────────────────────────── */
/* helpers                        */
/* ────────────────────────────── */

function normalizeFormValue(value: string | number | undefined): string {
  return value == null ? "" : String(value);
}

function clampNumber(value: string, min?: string, max?: string): string {
  if (value.trim() === "") return value;

  const num = Number(value);
  if (!Number.isFinite(num)) return value;

  const minNum = min !== undefined && min !== "" ? Number(min) : -Infinity;
  const maxNum = max !== undefined && max !== "" ? Number(max) : Infinity;

  return String(Math.min(Math.max(num, minNum), maxNum));
}

function normalizeDate(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
}

function normalizeTime(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19);
}

function formatSeconds(totalSeconds: number): string {
  totalSeconds = Math.round(totalSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = hours > 0 ? `${hours}:` : "";
  const mStr = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const sStr = String(seconds).padStart(2, "0");

  return `${hStr}${mStr}:${sStr}`;
}

/* ────────────────────────────── */
/* normalizers                    */
/* ────────────────────────────── */

function normalizeString(value: string, _field: InputFieldConfig): string {
  return value.trim();
}

function normalizeNumber(
  value: string,
  field: InputFieldConfig,
): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const num = Number(
    clampNumber(trimmed, field.min?.toString(), field.max?.toString()),
  );
  return Number.isFinite(num) ? num : null;
}

function normalizeEmail(value: string, _field: InputFieldConfig): string {
  return value.trim().toLowerCase();
}

function normalizeLogin(value: string, _field: InputFieldConfig): string {
  return value.includes("@") ? value.trim().toLowerCase() : value.trim();
}

function normalizeLocalTime(value: string, _field: InputFieldConfig): string {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
}

function normalizeWeather(
  value: string,
  _field: InputFieldConfig,
): string | undefined {
  return value === "" ? undefined : value;
}

export {
  normalizeFormValue,
  clampNumber,
  normalizeDate,
  normalizeTime,
  formatSeconds,
  normalizeString,
  normalizeNumber,
  normalizeEmail,
  normalizeLogin,
  normalizeLocalTime,
  normalizeWeather,
};
