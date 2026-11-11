import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card.jsx";
import { PALETTE, tooltipProps } from "@/features/analytics/chartTheme.js";
import {
  formatCompactInt,
  formatInt,
  formatShortDate,
} from "@/features/analytics/format.js";

export default function TrafficChart({ series }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const tick = { fill: "currentColor", fontSize: 12 };

  return (
    <Card className="p-6">
      <CardHeader
        title={t("analytics.traffic.title")}
        action={
          <ul className="flex items-center gap-4 text-xs">
            <li className="flex items-center gap-1.5">
              <span
                className="h-1 w-4 rounded-full"
                style={{ background: PALETTE.primary }}
              />
              {t("analytics.traffic.current")}
            </li>
            <li className="flex items-center gap-1.5 text-muted">
              <span className="h-0 w-4 border-t-2 border-dashed border-current" />
              {t("analytics.traffic.previous")}
            </li>
          </ul>
        }
      />

      {/* محور و شبکه با currentColor رنگ می‌گیرن؛ dir=ltr تا محور x توی فارسی برعکس نشه */}
      <div
        dir="ltr"
        role="img"
        aria-label={t("analytics.traffic.title")}
        className="h-72 text-muted"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={series}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              strokeOpacity={0.15}
            />
            <XAxis
              dataKey="at"
              tickFormatter={(v) => formatShortDate(v, lng)}
              tick={tick}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              tickFormatter={(v) => formatCompactInt(v, lng)}
              tick={tick}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              {...tooltipProps}
              labelFormatter={(v) => formatShortDate(v, lng)}
              formatter={(value, name) => [formatInt(value, lng), name]}
            />
            <Line
              type="monotone"
              dataKey="previous"
              name={t("analytics.traffic.previous")}
              stroke="currentColor"
              strokeOpacity={0.55}
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              name={t("analytics.traffic.current")}
              stroke={PALETTE.primary}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
