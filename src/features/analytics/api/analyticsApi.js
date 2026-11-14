import { http } from "@/lib/http.js";

export const RANGES = [7, 30, 90];

export function getAnalytics({ range = 30 } = {}) {
  return http("/analytics", { params: { range } });
}
