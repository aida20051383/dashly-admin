import { useTranslation } from "react-i18next";
import { DollarSign, Package, TrendingUp, User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card.jsx";
import Skeleton from "@/components/ui/Skeleton.jsx";
import QueryError from "@/components/ui/QueryError.jsx";
import { useStatistics } from "@/features/dashboard/hooks/useDashboard.js";
import {
  formatCompact,
  formatCurrency,
  formatRelativeTime,
} from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

const meta = {
  sales: { icon: TrendingUp, tone: "bg-primary/15 text-primary" },
  customers: { icon: User, tone: "bg-info/15 text-info" },
  products: { icon: Package, tone: "bg-danger/15 text-danger" },
  revenue: { icon: DollarSign, tone: "bg-success/15 text-success" },
};

const wholeDollars = { minimumFractionDigits: 0, maximumFractionDigits: 0 };

export default function StatisticsCard() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const { data, isPending, isError, refetch } = useStatistics();

  const formatValue = (item) =>
    item.format === "currency"
      ? formatCurrency(item.value, lng, wholeDollars)
      : formatCompact(item.value, lng);

  return (
    <Card className="h-full p-6">
      <CardHeader
        title={t("dashboard.statistics.title")}
        action={
          data && (
            <span className="whitespace-nowrap text-xs text-muted">
              {t("dashboard.statistics.updated", {
                time: formatRelativeTime(data.updatedAt, lng),
              })}
            </span>
          )
        }
      />

      {isError && <QueryError onRetry={refetch} />}

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {isPending &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}

        {data?.items.map((item) => {
          const { icon: Icon, tone } = meta[item.key];
          return (
            <div key={item.key} className="flex items-center gap-4">
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-full",
                  tone,
                )}
              >
                <Icon size={22} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-heading">
                  {formatValue(item)}
                </p>
                <p className="truncate text-sm">
                  {t(`dashboard.statistics.${item.key}`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
