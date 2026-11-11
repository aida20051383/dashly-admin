const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const RANGES = [7, 30, 90];

// عدد «تصادفی» قطعی بین ۰ و ۱؛ برای n یکسان همیشه همون جواب
const noise = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// بازدید روزی که k روز پیش بوده؛ رشد ملایم + افت آخر هفته + کمی نوسان
function visitorsOn(k) {
  const date = new Date();
  date.setDate(date.getDate() - k);
  const weekend = date.getDay() === 5 || date.getDay() === 6;
  const growth = 1500 + (200 - k) * 4;
  return Math.round(growth * (weekend ? 0.72 : 1) * (0.85 + noise(k) * 0.3));
}

const startOfDay = (k) => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - k).getTime();
};

const sum = (values) => values.reduce((a, b) => a + b, 0);
const change = (current, previous) => ((current - previous) / previous) * 100;

const SOURCES = [
  ["organic", 41],
  ["direct", 27],
  ["social", 15],
  ["referral", 11],
  ["email", 6],
];
const DEVICES = [
  ["desktop", 52],
  ["mobile", 41],
  ["tablet", 7],
];
const COUNTRIES = [
  ["US", 32],
  ["DE", 14],
  ["GB", 11],
  ["IR", 9],
  ["TR", 8],
  ["CA", 7],
  ["FR", 6],
];
const PAGES = [
  ["/", 0.3, 31],
  ["/products", 0.22, 42],
  ["/pricing", 0.14, 36],
  ["/blog/launch-day", 0.1, 58],
  ["/checkout", 0.07, 24],
];

export async function getAnalytics({ range = 30 } = {}) {
  await delay(600);

  const series = Array.from({ length: range }, (_, i) => {
    const k = range - 1 - i;
    return {
      at: startOfDay(k),
      visitors: visitorsOn(k),
      previous: visitorsOn(k + range),
    };
  });

  const visitors = sum(series.map((p) => p.visitors));
  const previousVisitors = sum(series.map((p) => p.previous));

  const pageViews = Math.round(visitors * (2.55 + noise(range) * 0.2));
  const previousPageViews = Math.round(
    previousVisitors * (2.5 + noise(range + 1) * 0.2),
  );

  const conversion = 3.2 + noise(range + 2) * 0.8;
  const previousConversion = 3.0 + noise(range + 7) * 0.6;

  const duration = Math.round(190 + noise(range + 3) * 60);
  const previousDuration = Math.round(180 + noise(range + 9) * 50);

  return {
    range,
    kpis: {
      visitors: { value: visitors, change: change(visitors, previousVisitors) },
      pageViews: {
        value: pageViews,
        change: change(pageViews, previousPageViews),
      },
      conversion: {
        value: conversion,
        change: change(conversion, previousConversion),
      },
      duration: { value: duration, change: change(duration, previousDuration) },
    },
    series,
    sources: SOURCES.map(([key, share]) => ({
      key,
      value: Math.round((visitors * share) / 100),
    })),
    devices: DEVICES.map(([key, share]) => ({
      key,
      value: Math.round((visitors * share) / 100),
    })),
    countries: COUNTRIES.map(([code, share]) => ({
      code,
      value: Math.round((visitors * share) / 100),
    })),
    pages: PAGES.map(([path, share, bounce]) => ({
      path,
      views: Math.round(pageViews * share),
      bounce,
    })),
  };
}
