import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card.jsx";
import Skeleton from "@/components/ui/Skeleton.jsx";
import QueryError from "@/components/ui/QueryError.jsx";
import GoalIllustration from "@/features/dashboard/components/GoalIllustration.jsx";
import { useGoal } from "@/features/dashboard/hooks/useDashboard.js";
import { formatCurrency, formatPercent } from "@/lib/format.js";

const whole = { minimumFractionDigits: 0, maximumFractionDigits: 0 };

export default function SalesGoalCard() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const { data, isPending, isError, refetch } = useGoal();

  const ratio = data ? Math.min(data.achieved / data.target, 1) : 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="grid place-items-center bg-primary/10 px-6 pt-6">
        <GoalIllustration className="h-36" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-lg font-semibold text-heading">
          {t("dashboard.goal.title")}
        </h2>

        {isError && (
          <div className="mt-3">
            <QueryError onRetry={refetch} />
          </div>
        )}

        {isPending && (
          <div className="mt-3 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2.5 w-full rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {data && (
          <>
            <p className="mt-1 text-sm">
              {t("dashboard.goal.reached", {
                value: formatPercent(ratio, lng, 0),
              })}
            </p>

            <div
              role="progressbar"
              aria-label={t("dashboard.goal.progress")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(ratio * 100)}
              className="mt-4 h-2.5 overflow-hidden rounded-full bg-hover"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-heading">
                {formatCurrency(data.achieved, lng, whole)}
              </span>
              <span className="text-muted">
                {formatCurrency(data.target, lng, whole)}
              </span>
            </div>
          </>
        )}

        <Link
          to="/dashboard/analytics"
          className="mt-auto rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90"
        >
          {t("dashboard.goal.viewReport")}
        </Link>
      </div>
    </Card>
  );
}
