function getStartOfDay(date: string) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
export { getStartOfDay };
