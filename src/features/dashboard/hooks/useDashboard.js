import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCompanies,
  getEarnings,
  getGoal,
  getOrders,
  getProfit,
  getRevenueReport,
  getStatistics,
  getWelcome,
  increaseBudget,
} from "@/features/dashboard/api/dashboardApi.js";

export const useWelcome = () =>
  useQuery({ queryKey: ["dashboard", "welcome"], queryFn: getWelcome });

export const useStatistics = () =>
  useQuery({ queryKey: ["dashboard", "statistics"], queryFn: getStatistics });

export const useOrders = () =>
  useQuery({ queryKey: ["dashboard", "orders"], queryFn: getOrders });

export const useProfit = () =>
  useQuery({ queryKey: ["dashboard", "profit"], queryFn: getProfit });

export const useEarnings = () =>
  useQuery({ queryKey: ["dashboard", "earnings"], queryFn: getEarnings });

export const useRevenueReport = (year) =>
  useQuery({
    queryKey: ["dashboard", "revenue", year],
    queryFn: () => getRevenueReport(year),
    placeholderData: keepPreviousData,
  });

export function useIncreaseBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: increaseBudget,
    onSuccess: (_result, { year }) =>
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "revenue", year],
      }),
  });
}

export const useCompanies = () =>
  useQuery({ queryKey: ["dashboard", "companies"], queryFn: getCompanies });

export const useGoal = () =>
  useQuery({ queryKey: ["dashboard", "goal"], queryFn: getGoal });
