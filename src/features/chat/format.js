export function formatListTime(timestamp, lng) {
  const date = new Date(timestamp);
  const today = date.toDateString() === new Date().toDateString();

  return new Intl.DateTimeFormat(
    lng,
    today ? { timeStyle: "short" } : { month: "short", day: "numeric" },
  ).format(date);
}

export function formatMessageTime(timestamp, lng) {
  return new Intl.DateTimeFormat(lng, { timeStyle: "short" }).format(
    new Date(timestamp),
  );
}
