import { useTranslation } from "react-i18next";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default function QueryError({ onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <TriangleAlert size={18} className="shrink-0 text-danger" />
      <span>{t("common.error")}</span>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-primary transition-colors hover:bg-primary/10"
      >
        <RefreshCw size={14} />
        {t("common.retry")}
      </button>
    </div>
  );
}
