import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Eye, Target, Users } from "lucide-react";
import ChoiceGroup from "@/features/settings/components/ChoiceGroup.jsx";
import KpiCard from "@/features/analytics/components/KpiCard.jsx";
import TrafficChart from "@/features/analytics/components/TrafficChart.jsx";
import DevicesCard from "@/features/analytics/components/DevicesCard.jsx";
import BreakdownCard from "@/features/analytics/components/BreakdownCard.jsx";
import TopPagesCard from "@/features/analytics/components/TopPagesCard.jsx";
import { RANGES } from "@/features/analytics/api/analyticsApi.js";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics.js";
import { PALETTE } from "@/features/analytics/chartTheme.js";
import {
  formatCompactInt,
  formatDuration,
  formatRate,
} from "@/features/analytics/format.js";
import { cn } from "@/lib/cn.js";

export default function AnalyticsPage() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const [range, setRange] = useState(30);

  const { data, isPending, isError, isPlaceholderData, refetch } =
    useAnalytics(range);

  const regionNames = useMemo(
    () => new Intl.DisplayNames(lng, { type: "region" }),
    [lng],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">
            {t("analytics.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("analytics.subtitle")}</p>
        </div>

        <ChoiceGroup
          label={t("analytics.range.label")}
          value={range}
          onChange={setRange}
          options={RANGES.map((value) => ({
            value,
            label: t(`analytics.range.d${value}`),
          }))}
        />
      </div>

      {isPending ? (
        <div
          aria-hidden="true"
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-card shadow-card"
            />
          ))}
          <div className="h-96 animate-pulse rounded-xl bg-card shadow-card sm:col-span-2 xl:col-span-4" />
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="rounded-xl bg-card p-10 text-center shadow-card"
        >
          <p className="font-medium text-heading">
            {t("analytics.error.title")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            {t("analytics.error.retry")}
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "space-y-6 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon={Users}
              tone="bg-primary/15 text-primary"
              label={t("analytics.kpis.visitors")}
              value={formatCompactInt(data.kpis.visitors.value, lng)}
              change={data.kpis.visitors.change}
            />
            <KpiCard
              icon={Eye}
              tone="bg-info/15 text-info"
              label={t("analytics.kpis.pageViews")}
              value={formatCompactInt(data.kpis.pageViews.value, lng)}
              change={data.kpis.pageViews.change}
            />
            <KpiCard
              icon={Target}
              tone="bg-success/15 text-success"
              label={t("analytics.kpis.conversion")}
              value={formatRate(data.kpis.conversion.value, lng)}
              change={data.kpis.conversion.change}
            />
            <KpiCard
              icon={Clock}
              tone="bg-warning/15 text-warning"
              label={t("analytics.kpis.duration")}
              value={formatDuration(data.kpis.duration.value, lng)}
              change={data.kpis.duration.change}
            />
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrafficChart series={data.series} />
            </div>
            <DevicesCard devices={data.devices} />
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TopPagesCard pages={data.pages} />
            </div>
            <div className="space-y-6">
              <BreakdownCard
                title={t("analytics.sources.title")}
                color={PALETTE.primary}
                items={data.sources.map((s) => ({
                  key: s.key,
                  label: t(`analytics.sources.${s.key}`),
                  value: s.value,
                }))}
              />
              <BreakdownCard
                title={t("analytics.countries.title")}
                color={PALETTE.success}
                items={data.countries.map((c) => ({
                  key: c.code,
                  label: regionNames.of(c.code),
                  value: c.value,
                }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
