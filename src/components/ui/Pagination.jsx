import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "@/components/ui/Select.jsx";
import { formatNumber } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

// مثلاً صفحه ۵ از ۱۰ ← [1, 'gap-start', 4, 5, 6, 'gap-end', 10]
function getPageItems(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);

  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(count - 1, page + 1);

  if (start > 2) items.push("gap-start");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < count - 1) items.push("gap-end");
  items.push(count);
  return items;
}

const btn =
  "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm transition-colors";

export default function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
}) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <Select
          label={t("pagination.perPage")}
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
          options={pageSizeOptions.map((n) => ({
            value: String(n),
            label: formatNumber(n, lng),
          }))}
          className="w-24"
        />
        <p className="text-sm text-muted">
          {t("pagination.showing", {
            from: formatNumber(from, lng),
            to: formatNumber(to, lng),
            total: formatNumber(total, lng),
          })}
        </p>
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={t("pagination.previous")}
          className={cn(
            btn,
            "text-foreground hover:bg-hover disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ChevronLeft size={18} className="rtl:rotate-180" />
        </button>

        {getPageItems(page, pageCount).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={t("pagination.page", { n: formatNumber(item, lng) })}
              className={cn(
                btn,
                item === page
                  ? "bg-primary font-semibold text-white shadow-glow"
                  : "text-foreground hover:bg-hover",
              )}
            >
              {formatNumber(item, lng)}
            </button>
          ) : (
            <span key={item} aria-hidden="true" className="px-1 text-muted">
              …
            </span>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label={t("pagination.next")}
          className={cn(
            btn,
            "text-foreground hover:bg-hover disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ChevronRight size={18} className="rtl:rotate-180" />
        </button>
      </nav>
    </div>
  );
}
