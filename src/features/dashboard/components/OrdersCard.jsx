import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MiniChartCard from "@/features/dashboard/components/MiniChartCard.jsx";
import { useOrders } from "@/features/dashboard/hooks/useDashboard.js";
import { colors, tooltipProps } from "@/lib/colors.js";
import { formatNumber } from "@/lib/format.js";

export default function OrdersCard() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const query = useOrders();

  return (
    <MiniChartCard
      title={t("dashboard.orders.title")}
      query={query}
      renderChart={(data) => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.weeks}
            margin={{ top: 0, right: 4, bottom: 0, left: 4 }}
          >
            <XAxis dataKey="week" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              {...tooltipProps}
              cursor={false}
              labelFormatter={(week) =>
                t("dashboard.week", { n: formatNumber(week, lng) })
              }
              formatter={(value) => [
                formatNumber(value, lng),
                t("dashboard.orders.title"),
              ]}
            />
            <Bar
              dataKey="value"
              fill={colors.warning}
              barSize={10}
              radius={6}
              background={{ fill: "rgba(165, 163, 174, 0.18)", radius: 6 }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    />
  );
}
