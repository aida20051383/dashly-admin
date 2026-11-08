import { useTranslation } from "react-i18next";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MiniChartCard from "@/features/dashboard/components/MiniChartCard.jsx";
import { useProfit } from "@/features/dashboard/hooks/useDashboard.js";
import { colors, tooltipProps } from "@/lib/colors.js";
import { formatNumber } from "@/lib/format.js";

export default function ProfitCard() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const query = useProfit();

  return (
    <MiniChartCard
      title={t("dashboard.profit.title")}
      query={query}
      renderChart={(data) => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.weeks}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <XAxis dataKey="week" hide />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip
              {...tooltipProps}
              cursor={false}
              labelFormatter={(week) =>
                t("dashboard.week", { n: formatNumber(week, lng) })
              }
              formatter={(value) => [
                formatNumber(value, lng),
                t("dashboard.profit.title"),
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.info}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    />
  );
}
