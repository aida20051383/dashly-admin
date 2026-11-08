import { useTranslation } from "react-i18next";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card.jsx";
import Skeleton from "@/components/ui/Skeleton.jsx";
import QueryError from "@/components/ui/QueryError.jsx";
import { useEarnings } from "@/features/dashboard/hooks/useDashboard.js";
import { tooltipProps } from "@/lib/colors.js";
import { formatCurrency, formatPercent } from "@/lib/format.js";

// سه سایه‌ی سبز (دو تای آخر نیمه‌شفاف، تا توی هر دو تم خوب دیده بشن)
const fills = ["#28c76f", "#28c76f66", "#28c76f2e"];

export default function EarningsCard() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const { data, isPending, isError, refetch } = useEarnings();

  const segments = data?.segments.map((s, i) => ({
    ...s,
    name: t(`dashboard.earnings.segments.${s.key}`),
    fill: fills[i % fills.length],
  }));
  const main = segments?.[0];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-heading">
            {t("dashboard.earnings.title")}
          </h2>

          {isError ? (
            <div className="mt-4">
              <QueryError onRetry={refetch} />
            </div>
          ) : (
            <>
              <p className="mt-5 text-sm text-muted">
                {t("dashboard.earnings.thisMonth")}
              </p>
              {isPending ? (
                <Skeleton className="mt-1 h-7 w-28" />
              ) : (
                <p className="text-2xl font-bold text-heading">
                  {formatCurrency(data.amount, lng)}
                </p>
              )}

              <div className="mt-4 text-sm text-muted">
                {isPending ? (
                  <Skeleton className="h-4 w-40" />
                ) : (
                  t("dashboard.earnings.growth", {
                    value: formatPercent(data.growth, lng),
                  })
                )}
              </div>
            </>
          )}
        </div>

        <div dir="ltr" className="relative size-36 shrink-0">
          {isPending && <Skeleton className="size-full rounded-full" />}

          {segments && (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="68%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                    stroke="none"
                  />
                  <Tooltip
                    {...tooltipProps}
                    formatter={(value, name) => [
                      formatPercent(value / 100, lng, 0),
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* درصد وسط دونات */}
              <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
                <p className="text-xl font-bold text-heading">
                  {formatPercent(main.value / 100, lng, 0)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
