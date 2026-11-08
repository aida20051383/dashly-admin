const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DAY = 24 * 60 * 60 * 1000;

export async function getWelcome() {
  await delay(400);
  return { amount: 48900 };
}

export async function getStatistics() {
  await delay(600);
  return {
    updatedAt: Date.now() - 30 * DAY,
    items: [
      { key: "sales", value: 230000, format: "compact" },
      { key: "customers", value: 8549, format: "compact" },
      { key: "products", value: 1423, format: "compact" },
      { key: "revenue", value: 9745, format: "currency" },
    ],
  };
}

export async function getOrders() {
  await delay(500);
  return {
    total: 2760,
    weeks: [
      { week: 1, value: 45 },
      { week: 2, value: 72 },
      { week: 3, value: 58 },
      { week: 4, value: 34 },
      { week: 5, value: 68 },
    ],
  };
}

export async function getProfit() {
  await delay(700);
  return {
    total: 6240,
    weeks: [
      { week: 1, value: 30 },
      { week: 2, value: 52 },
      { week: 3, value: 38 },
      { week: 4, value: 62 },
      { week: 5, value: 80 },
    ],
  };
}

export async function getEarnings() {
  await delay(800);
  return {
    amount: 4055.56,
    growth: 0.682, // یعنی ۶۸٫۲٪
    segments: [
      { key: "app", value: 53 },
      { key: "service", value: 30 },
      { key: "other", value: 17 },
    ],
  };
}

// ---------- Revenue Report ----------

export const REVENUE_YEARS = [2026, 2025, 2024];

const YEAR_FACTOR = { 2026: 1, 2025: 0.9, 2024: 0.78 };

// [earning, expense] هر ماه به صدها دلار
const REVENUE_BASE = [
  [100, -150],
  [180, -90],
  [290, -50],
  [250, -190],
  [110, -110],
  [60, -70],
  [170, -105],
  [215, -80],
  [75, -105],
];

const SPEND_CURRENT = [30, 45, 28, 52, 38, 60, 35, 48, 40, 58, 46, 50];
const SPEND_PREVIOUS = [20, 28, 35, 25, 32, 22, 30, 26, 34, 24, 30, 28];

// بودجه‌ی هر سال؛ با increaseBudget تغییر می‌کنه (با رفرش صفحه برمی‌گرده، چون mock ـه)
const budgets = { 2026: 56800, 2025: 54000, 2024: 50000 };

export async function getRevenueReport(year) {
  await delay(700);
  const factor = YEAR_FACTOR[year] ?? 1;
  return {
    year,
    months: REVENUE_BASE.map(([earning, expense], i) => ({
      month: i + 1,
      earning: Math.round(earning * factor) * 100,
      expense: Math.round(expense * factor) * 100,
    })),
    budget: {
      spent: Math.round(25852 * factor),
      total: budgets[year] ?? 0,
      trend: SPEND_CURRENT.map((current, i) => ({
        current,
        previous: SPEND_PREVIOUS[i],
      })),
    },
  };
}

export async function increaseBudget({ year, amount }) {
  await delay(600);
  if (!(amount > 0)) throw new Error("Invalid amount");
  budgets[year] = (budgets[year] ?? 0) + amount;
  return { year, total: budgets[year] };
}
// ---------- Top Companies و Goal ----------

export async function getCompanies() {
  await delay(900);
  return [
    {
      id: 1,
      name: "Nordic Gear",
      email: "hello@nordicgear.example",
      category: "technology",
      views: 23400,
      period: "h24",
      revenue: 891.2,
      sales: 68,
      trend: "down",
    },
    {
      id: 2,
      name: "Fresh Basket",
      email: "team@freshbasket.example",
      category: "grocery",
      views: 78000,
      period: "d2",
      revenue: 668.51,
      sales: 97,
      trend: "up",
    },
    {
      id: 3,
      name: "Urban Thread",
      email: "shop@urbanthread.example",
      category: "fashion",
      views: 162,
      period: "d7",
      revenue: 522.29,
      sales: 62,
      trend: "up",
    },
    {
      id: 4,
      name: "Medora Clinic",
      email: "care@medora.example",
      category: "health",
      views: 9540,
      period: "d7",
      revenue: 1204.8,
      sales: 81,
      trend: "up",
    },
    {
      id: 5,
      name: "Summit Sports",
      email: "info@summitsports.example",
      category: "sports",
      views: 15200,
      period: "d30",
      revenue: 745,
      sales: 54,
      trend: "down",
    },
    {
      id: 6,
      name: "Pulse Fitness",
      email: "join@pulsefit.example",
      category: "fitness",
      views: 4310,
      period: "h24",
      revenue: 389.75,
      sales: 73,
      trend: "up",
    },
  ];
}

export async function getGoal() {
  await delay(500);
  return { achieved: 38250, target: 50000 };
}
