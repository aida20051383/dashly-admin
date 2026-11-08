import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card.jsx";
import Skeleton from "@/components/ui/Skeleton.jsx";
import QueryError from "@/components/ui/QueryError.jsx";
import { formatCompact } from "@/lib/format.js";

export default function MiniChartCard({ title, query, renderChart }) {
  const { i18n } = useTranslation();
  const { data, isPending, isError, refetch } = query;

  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold text-heading">{title}</h2>

      {isError ? (
        <div className="mt-4">
          <QueryError onRetry={refetch} />
        </div>
      ) : (
        <>
          <div className="mt-1 h-8">
            {isPending ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <p className="text-2xl font-bold text-heading">
                {formatCompact(data.total, i18n.language)}
              </p>
            )}
          </div>

          <div dir="ltr" className="mt-4 h-24">
            {isPending ? (
              <Skeleton className="h-full w-full" />
            ) : (
              renderChart(data)
            )}
          </div>
        </>
      )}
    </Card>
  );
}
