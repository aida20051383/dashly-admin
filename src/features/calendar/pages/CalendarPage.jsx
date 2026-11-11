import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import CalendarGrid from "@/features/calendar/components/CalendarGrid.jsx";
import DayPanel from "@/features/calendar/components/DayPanel.jsx";
import { useEvents } from "@/features/calendar/hooks/useEvents.js";
import {
  buildMonthGrid,
  formatMonthTitle,
  shiftMonth,
  startOfMonth,
  toKey,
} from "@/lib/calendar.js";

export default function CalendarPage() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;

  const [anchor, setAnchor] = useState(() => new Date());
  const [selectedKey, setSelectedKey] = useState(() => toKey(new Date()));

  const cursor = useMemo(() => startOfMonth(anchor, lng), [anchor, lng]);
  const cells = useMemo(() => buildMonthGrid(cursor, lng), [cursor, lng]);
  const range = { from: cells[0].key, to: cells[41].key };

  const { data, isError, refetch } = useEvents(range);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const event of data ?? []) {
      map.set(event.date, [...(map.get(event.date) ?? []), event]);
    }
    return map;
  }, [data]);

  const goTo = (delta) => setAnchor(shiftMonth(cursor, delta, lng));
  const goToday = () => {
    setAnchor(new Date());
    setSelectedKey(toKey(new Date()));
  };

  const navButton =
    "grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-hover hover:text-primary";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">
          {t("calendar.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("calendar.subtitle")}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card className="p-4 sm:p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2
              aria-live="polite"
              className="me-auto text-lg font-semibold text-heading"
            >
              {formatMonthTitle(cursor, lng)}
            </h2>
            <button
              type="button"
              onClick={goToday}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
            >
              {t("calendar.today")}
            </button>
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label={t("calendar.prev")}
              className={navButton}
            >
              <ChevronLeft size={20} className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label={t("calendar.next")}
              className={navButton}
            >
              <ChevronRight size={20} className="rtl:rotate-180" />
            </button>
          </div>

          {isError && (
            <div
              role="alert"
              className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {t("calendar.error.title")}
              <button
                type="button"
                onClick={() => refetch()}
                className="font-medium underline"
              >
                {t("calendar.error.retry")}
              </button>
            </div>
          )}

          <CalendarGrid
            cells={cells}
            eventsByDay={eventsByDay}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
        </Card>

        <DayPanel
          key={selectedKey}
          dayKey={selectedKey}
          events={eventsByDay.get(selectedKey) ?? []}
        />
      </div>
    </div>
  );
}
