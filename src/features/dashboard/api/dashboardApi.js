import { http } from "@/lib/http.js";

export const REVENUE_YEARS = [2026, 2025, 2024];

export const getWelcome = () => http("/dashboard/welcome");
export const getStatistics = () => http("/dashboard/statistics");
export const getOrders = () => http("/dashboard/orders");
export const getProfit = () => http("/dashboard/profit");
export const getEarnings = () => http("/dashboard/earnings");
export const getCompanies = () => http("/dashboard/companies");
export const getGoal = () => http("/dashboard/goal");

export const getRevenueReport = (year) =>
  http("/dashboard/revenue", { params: { year } });

export const increaseBudget = ({ year, amount }) =>
  http("/dashboard/budget", { method: "POST", body: { year, amount } });
