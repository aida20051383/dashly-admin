import { useTranslation } from "react-i18next";
import { Card, CardHeader } from "@/components/ui/Card.jsx";
import { formatCompactInt, formatRate } from "@/features/analytics/format.js";

export default function BreakdownCard({ title, items, color }) {
  const { i18n } = useTranslation();
  const lng = i18n.language;
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-6">
      <CardHeader title={title} />

      <ul className="space-y-4">
        {items.map(({ key, label, value }) => {
          const share = (value / total) * 100;
          return (
            <li key={key}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-heading">
                  {label}
                </span>
                <span className="shrink-0 text-muted">
                  {formatCompactInt(value, lng)} · {formatRate(share, lng)}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(share)}
                className="h-2 overflow-hidden rounded-full bg-hover"
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${share}%`, background: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
