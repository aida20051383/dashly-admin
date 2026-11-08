import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card.jsx";
import Skeleton from "@/components/ui/Skeleton.jsx";
import QueryError from "@/components/ui/QueryError.jsx";
import YearSelect from "@/features/dashboard/components/YearSelect.jsx";
import IncreaseBudgetModal from "@/features/dashboard/components/IncreaseBudgetModal.jsx";
import { REVENUE_YEARS } from "@/features/dashboard/api/dashboardApi.js";
import { useRevenueReport } from "@/features/dashboard/hooks/useDashboard.js";
import { colors, tooltipProps } from "@/lib/colors.js";
import {
  formatCompact,
  formatCurrency,
  formatMonth,
  formatNumber,
  formatYear,
} from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

const whole = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
const axisTick = { fill: "var(--muted)", fontSize: 12 };

export default function RevenueReportCard() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const [year, setYear] = useState(REVENUE_YEARS[0]);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isPending, isError, isPlaceholderData, refetch } =
    useRevenueReport(year);

  return (
    <Card className="h-full overflow-hidden">
      <div className="grid h-full md:grid-cols-[minmax(0,1fr)_15rem]">
        {/* نمودار اصلی */}
        <section className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-heading">
              {t("dashboard.revenue.title")}
            </h2>
            <ul className="flex items-center gap-4 text-sm">
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-primary" />
                {t("dashboard.revenue.earning")}
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-warning" />
                {t("dashboard.revenue.expense")}
              </li>
            </ul>
          </div>

          {isError ? (
            <QueryError onRetry={refetch} />
          ) : (
            <div
              dir="ltr"
              className={cn(
                "h-72 transition-opacity",
                isPlaceholderData && "opacity-50",
              )}
            >
              {isPending ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.months}
                    margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      stroke="var(--border)"
                      strokeDasharray="4 4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(m) => formatMonth(m, lng)}
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => formatCompact(v, lng)}
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                    />
                    <Tooltip
                      {...tooltipProps}
                      cursor={{ fill: "var(--hover)", opacity: 0.5 }}
                      labelFormatter={(m) =>
                        `${formatMonth(m, lng)} ${formatYear(year, lng)}`
                      }
                      formatter={(value, name) => [
                        formatCurrency(Math.abs(value), lng, whole),
                        name,
                      ]}
                    />
                    {/* stackId: مثبت‌ها بالا و منفی‌ها پایین صفر جمع می‌شن */}
                    <Bar
                      dataKey="earning"
                      name={t("dashboard.revenue.earning")}
                      stackId="revenue"
                      fill={colors.primary}
                      barSize={10}
                      radius={6}
                    />
                    <Bar
                      dataKey="expense"
                      name={t("dashboard.revenue.expense")}
                      stackId="revenue"
                      fill={colors.warning}
                      barSize={10}
                      radius={6}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </section>

        {/* پنل بودجه */}
        <aside className="border-t border-border p-6 md:border-s md:border-t-0">
          <div className="flex justify-center">
            <YearSelect years={REVENUE_YEARS} value={year} onChange={setYear} />
          </div>

          <div className="mt-6 text-center">
            {data ? (
              <>
                <p className="text-2xl font-bold text-heading">
                  {formatCurrency(data.budget.spent, lng, whole)}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {t("dashboard.revenue.budget", {
                    value: formatNumber(data.budget.total, lng),
                  })}
                </p>
              </>
            ) : (
              <div className="grid justify-items-center gap-2">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            )}
          </div>

          <div
            dir="ltr"
            className={cn(
              "mt-4 h-28 transition-opacity",
              isPlaceholderData && "opacity-50",
            )}
          >
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.budget.trend}
                  margin={{ top: 8, right: 4, bottom: 8, left: 4 }}
                >
                  <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    stroke="var(--muted)"
                    strokeOpacity={0.6}
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke={colors.primary}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={!data}
            className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {t("dashboard.revenue.increaseBudget")}
          </button>
        </aside>
      </div>

      <IncreaseBudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        year={year}
      />
    </Card>
  );
}
