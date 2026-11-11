export const formatInt = (value, lng) =>
  new Intl.NumberFormat(lng).format(value);

export const formatCompactInt = (value, lng) =>
  new Intl.NumberFormat(lng, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

// مثلاً 3.4 → «٪۳٫۴» یا «3.4%»
export const formatRate = (value, lng) =>
  new Intl.NumberFormat(lng, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);

// با علامت + یا -
export const formatChange = (value, lng) =>
  new Intl.NumberFormat(lng, {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(value / 100);

// ثانیه ← دقیقه:ثانیه
export function formatDuration(totalSeconds, lng) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const two = new Intl.NumberFormat(lng, { minimumIntegerDigits: 2 });
  return `${new Intl.NumberFormat(lng).format(minutes)}:${two.format(seconds)}`;
}

export const formatShortDate = (timestamp, lng) =>
  new Intl.DateTimeFormat(lng, { month: "short", day: "numeric" }).format(
    timestamp,
  );
