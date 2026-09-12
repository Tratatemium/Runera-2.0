function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function hasKey<T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
): key is K & keyof T {
  return Object.hasOwn(obj, key);
}

function formatDateString(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateString}T12:00:00`));
}

export { isSameDay, hasKey, formatDateString };
