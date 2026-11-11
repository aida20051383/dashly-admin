export const CATEGORIES = ["meeting", "work", "personal", "deadline"];

const isFa = (lng) => lng.startsWith("fa");

export const toKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const weekStartFor = (lng) => (isFa(lng) ? 6 : 0);

export const isHoliday = (date, lng) => isFa(lng) && date.getDay() === 5;

const systemFor = (lng) => (isFa(lng) ? "persian" : "gregory");
const displayLocale = (lng) =>
  isFa(lng) ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory";

const partsFormatters = new Map();
function dateParts(date, lng) {
  const calendar = systemFor(lng);
  if (!partsFormatters.has(calendar)) {
    partsFormatters.set(
      calendar,
      new Intl.DateTimeFormat(`en-US-u-ca-${calendar}-nu-latn`, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
    );
  }

  const parts = {};
  for (const { type, value } of partsFormatters
    .get(calendar)
    .formatToParts(date)) {
    if (type === "year" || type === "month" || type === "day")
      parts[type] = Number(value);
  }
  return parts;
}

const addDays = (date, n) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

export function startOfMonth(date, lng) {
  return addDays(date, -(dateParts(date, lng).day - 1));
}

export function shiftMonth(cursor, delta, lng) {
  return startOfMonth(
    delta > 0 ? addDays(cursor, 32) : addDays(cursor, -1),
    lng,
  );
}

export function buildMonthGrid(cursor, lng) {
  const offset = (cursor.getDay() - weekStartFor(lng) + 7) % 7;
  const current = dateParts(cursor, lng);
  const monthId = current.year * 100 + current.month;

  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(cursor, i - offset);
    const p = dateParts(date, lng);
    return {
      date,
      key: toKey(date),
      label: p.day,
      inMonth: p.year * 100 + p.month === monthId,
    };
  });
}

export function weekdayLabels(lng) {
  const weekStart = weekStartFor(lng);
  const formatter = new Intl.DateTimeFormat(displayLocale(lng), {
    weekday: isFa(lng) ? "narrow" : "short",
  });
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(2024, 0, 7 + ((weekStart + i) % 7))),
  );
}

export const formatMonthTitle = (date, lng) =>
  new Intl.DateTimeFormat(displayLocale(lng), {
    month: "long",
    year: "numeric",
  }).format(date);

export const formatFullDate = (date, lng) =>
  new Intl.DateTimeFormat(displayLocale(lng), { dateStyle: "full" }).format(
    date,
  );
