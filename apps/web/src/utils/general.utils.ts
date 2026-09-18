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

  switch (variant) {
    case "short":
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(`${dateString}T12:00:00`));
    case "full with time":
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date(`${dateString}T12:00:00`));
    case "full with weekday":
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(`${dateString}T12:00:00`));
  }
}

function pluralize(label: string, count: number): string {
  return `${label}${count === 1 ? "" : "s"}`;
}

export { isSameDay, formatDateString, toDateOnlyString, pluralize };
