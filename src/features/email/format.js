export function formatStamp(timestamp, lng) {
  const date = new Date(timestamp);
  const today = date.toDateString() === new Date().toDateString();

  return new Intl.DateTimeFormat(
    lng,
    today ? { timeStyle: "short" } : { month: "short", day: "numeric" },
  ).format(date);
}

export function formatFull(timestamp, lng) {
  return new Intl.DateTimeFormat(lng, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}
