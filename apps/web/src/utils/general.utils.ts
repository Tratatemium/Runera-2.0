import { assertAllowed } from "@runera/shared";

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Formats a Date as "YYYY-MM-DD" using local date parts (avoids UTC day-shift from toISOString)
function toDateOnlyString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateString(
  dateString: string,
  variant: "short" | "full with time" | "full with weekday",
) {
  assertAllowed(variant, "variant", [
    "short",
    "full with time",
    "full with weekday",
  ]);

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ? `${dateString}T12:00:00`
      : dateString,
  );

  switch (variant) {
    case "short":
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    case "full with time":
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(date);
    case "full with weekday":
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
  }
}

function pluralize(label: string, count: number): string {
  return `${label}${count === 1 ? "" : "s"}`;
}

function getScaleColor(value: number): string {
  const clamped = Math.max(0, Math.min(100, value));

  const start = [0x5d, 0xca, 0xa5]; // #5dcaa5
  const middle = [0xf9, 0xc5, 0x6d]; // #f9c56d
  const end = [0xed, 0x48, 0x48]; // #ed4848

  const interpolate = (a: number[], b: number[], t: number) =>
    a.map((channel, i) => Math.round(channel + (b[i] - channel) * t));

  const rgb =
    clamped <= 50
      ? interpolate(start, middle, clamped / 50)
      : interpolate(middle, end, (clamped - 50) / 50);

  return `rgb(${rgb.join(", ")})`;
}

export {
  isSameDay,
  formatDateString,
  toDateOnlyString,
  pluralize,
  getScaleColor,
};
