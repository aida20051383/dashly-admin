import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/features/analytics/api/analyticsApi.js";

export const useAnalytics = (range) =>
  useQuery({
    queryKey: ["analytics", range],
    queryFn: () => getAnalytics({ range }),
    placeholderData: keepPreviousData,
  });
