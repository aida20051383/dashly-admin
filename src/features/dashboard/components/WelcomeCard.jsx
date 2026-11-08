import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card.jsx";
import Skeleton from "@/components/ui/Skeleton.jsx";
import QueryError from "@/components/ui/QueryError.jsx";
import MedalIllustration from "@/features/dashboard/components/MedalIllustration.jsx";
import { useWelcome } from "@/features/dashboard/hooks/useDashboard.js";
import { formatCurrency } from "@/lib/format.js";

export default function WelcomeCard() {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch } = useWelcome();

  return (
    <Card className="relative h-full overflow-hidden p-6">
      <MedalIllustration className="pointer-events-none absolute end-6 top-0 h-32" />

      <div className="max-w-[70%]">
        <h2 className="text-lg font-semibold text-heading">
          {t("dashboard.welcome.title", { name: t("dashboard.welcome.name") })}
        </h2>
        <p className="mt-1 text-sm">{t("dashboard.welcome.subtitle")}</p>
      </div>

      <div className="mt-6">
        {isPending && <Skeleton className="h-9 w-28" />}
        {isError && <QueryError onRetry={refetch} />}
        {data && (
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(data.amount, i18n.language, {
              notation: "compact",
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            })}
          </p>
        )}
      </div>

      <Link
        to="/dashboard/analytics"
        className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90"
      >
        {t("dashboard.welcome.viewSales")}
      </Link>
    </Card>
  );
}
