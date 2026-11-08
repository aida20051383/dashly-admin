const localeOf = (lng) => (lng === "fa" ? "fa-IR" : "en-US");

export function formatNumber(value, lng) {
  return new Intl.NumberFormat(localeOf(lng)).format(value);
}

export function formatCompact(value, lng) {
  return new Intl.NumberFormat(localeOf(lng), {
    notation: "compact",
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatCurrency(value, lng, options = {}) {
  return new Intl.NumberFormat(localeOf(lng), {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
}

export function formatRelativeTime(timestamp, lng) {
  const rtf = new Intl.RelativeTimeFormat(lng === "fa" ? "fa" : "en", {
    numeric: "auto",
  });
  const diffSeconds = (timestamp - Date.now()) / 1000;

  const units = [
    ["month", 30 * 86400],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return rtf.format(0, "second");
}
export function formatPercent(value, lng, digits = 1) {
  return new Intl.NumberFormat(localeOf(lng), {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}
export function formatMonth(month, lng) {
  const locale = lng === "fa" ? "fa-IR-u-ca-gregory" : "en-US";
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(
    new Date(2000, month - 1, 1),
  );
}

export function formatYear(year, lng) {
  return new Intl.NumberFormat(localeOf(lng), { useGrouping: false }).format(
    year,
  );
}
