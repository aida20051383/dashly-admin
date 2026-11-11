import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ListChecks, Search } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import TodoForm from "@/features/todo/components/TodoForm.jsx";
import TodoItem from "@/features/todo/components/TodoItem.jsx";
import { PRIORITIES } from "@/features/todo/api/todoApi.js";
import { useTodos } from "@/features/todo/hooks/useTodos.js";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { formatNumber } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

const TABS = ["all", "active", "done"];

export default function TodoPage() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;

  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isPending, isError, refetch } = useTodos({
    status,
    priority,
    search: debouncedSearch,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">{t("todo.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("todo.subtitle")}</p>
      </div>

      <TodoForm />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4 sm:px-5">
          <div
            role="tablist"
            className="inline-flex rounded-lg border border-border p-1"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={status === tab}
                onClick={() => setStatus(tab)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  status === tab
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-hover",
                )}
              >
                {t(`todo.filters.${tab}`)}
                {data && (
                  <span className="ms-1.5 opacity-80">
                    {formatNumber(data.counts[tab], lng)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label={t("todo.priority.label")}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-heading outline-none focus:border-primary"
          >
            <option value="all">{t("todo.priority.all")}</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {t(`todo.priority.${p}`)}
              </option>
            ))}
          </select>

          <div className="relative ms-auto w-full sm:w-56">
            <Search
              size={16}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("todo.search")}
              aria-label={t("todo.search")}
              className="h-10 w-full rounded-lg border border-border bg-transparent ps-9 pe-3 text-sm text-heading outline-none placeholder:text-muted focus:border-primary"
            />
          </div>
        </div>

        {isPending ? (
          <ul aria-hidden="true" className="divide-y divide-border">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i} className="px-5 py-4">
                <div className="h-10 animate-pulse rounded-md bg-hover" />
              </li>
            ))}
          </ul>
        ) : isError ? (
          <div role="alert" className="p-10 text-center">
            <p className="font-medium text-heading">{t("todo.error.title")}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              {t("todo.error.retry")}
            </button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="flex flex-col items-center p-10 text-center">
            <span className="mb-3 grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
              <ListChecks size={24} />
            </span>
            <p className="font-medium text-heading">{t("todo.empty.title")}</p>
            <p className="mt-1 text-sm text-muted">
              {t("todo.empty.description")}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.items.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
