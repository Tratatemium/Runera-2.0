import { assertAllowed } from "@runera/shared";

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatDateString(
  dateString: string,
  variant: "short" | "full with time",
) {
  assertAllowed(variant, "variant", ["short", "full with time"]);

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
  }
}

export { isSameDay, formatDateString };
