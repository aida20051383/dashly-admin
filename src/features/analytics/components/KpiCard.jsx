import { useTranslation } from "react-i18next";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import { formatChange } from "@/features/analytics/format.js";
import { cn } from "@/lib/cn.js";

export default function KpiCard({ icon: Icon, tone, label, value, change }) {
  const { t, i18n } = useTranslation();
  const up = change >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn("grid size-11 place-items-center rounded-lg", tone)}
        >
          <Icon size={22} />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold",
            up ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
          )}
        >
          <Arrow size={14} />
          <bdi dir="ltr">{formatChange(change, i18n.language)}</bdi>
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-heading">{value}</p>
      <p className="mt-1 text-sm">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{t("analytics.vsPrevious")}</p>
    </Card>
  );
}
