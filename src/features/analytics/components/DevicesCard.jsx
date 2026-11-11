import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card.jsx";
import { PALETTE, tooltipProps } from "@/features/analytics/chartTheme.js";
import { formatInt, formatRate } from "@/features/analytics/format.js";

const COLORS = [PALETTE.primary, PALETTE.success, PALETTE.warning];

export default function DevicesCard({ devices }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const total = devices.reduce((sum, d) => sum + d.value, 0);
  const data = devices.map((d) => ({
    ...d,
    name: t(`analytics.devices.${d.key}`),
  }));

  return (
    <Card className="p-6">
      <CardHeader title={t("analytics.devices.title")} />

      <div
        dir="ltr"
        role="img"
        aria-label={t("analytics.devices.title")}
        className="h-52"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              {...tooltipProps}
              formatter={(value, name) => [formatInt(value, lng), name]}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={d.key} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 space-y-3">
        {data.map((d, i) => (
          <li key={d.key} className="flex items-center gap-3 text-sm">
            <span
              className="size-3 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-heading">{d.name}</span>
            <span className="ms-auto text-muted">
              {formatRate((d.value / total) * 100, lng)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
