import { useTranslation } from "react-i18next";
import {
  formatFullDate,
  isHoliday,
  toKey,
  weekdayLabels,
} from "@/lib/calendar.js";
import { formatNumber } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

export const categoryStyles = {
  meeting: { chip: "bg-primary/15 text-primary", dot: "bg-primary" },
  work: { chip: "bg-info/15 text-info", dot: "bg-info" },
  personal: { chip: "bg-success/15 text-success", dot: "bg-success" },
  deadline: { chip: "bg-danger/15 text-danger", dot: "bg-danger" },
};

export default function CalendarGrid({
  cells,
  eventsByDay,
  selectedKey,
  onSelect,
}) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const todayKey = toKey(new Date());
  const labels = weekdayLabels(lng);

  return (
    <div>
      <div className="grid grid-cols-7 pb-2 text-center text-xs font-medium text-muted">
        {labels.map((label, i) => (
          <span
            key={i}
            className={cn(isHoliday(cells[i].date, lng) && "text-danger")}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {cells.map(({ date, key, label, inMonth }) => {
          const dayEvents = eventsByDay.get(key) ?? [];
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;
          const holiday = isHoliday(date, lng);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-label={`${formatFullDate(date, lng)}${dayEvents.length ? `, ${formatNumber(dayEvents.length, lng)}` : ""}`}
              className={cn(
                "flex min-h-16 flex-col items-start gap-1 bg-card p-1.5 text-start transition-colors hover:bg-hover sm:min-h-28 sm:p-2",
                !inMonth && "text-muted opacity-60",
                isSelected &&
                  "bg-primary/10 outline-2 -outline-offset-2 outline-primary",
              )}
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-sm font-medium",
                  isToday
                    ? "bg-primary text-white shadow-glow"
                    : holiday
                      ? "text-danger"
                      : inMonth && "text-heading",
                )}
              >
                {formatNumber(label, lng)}
              </span>

              <div className="hidden w-full flex-col gap-1 sm:flex">
                {dayEvents.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    className={cn(
                      "truncate rounded px-1.5 py-0.5 text-[11px] font-medium",
                      categoryStyles[event.category].chip,
                    )}
                  >
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="px-1 text-[11px] text-muted">
                    {t("calendar.more", {
                      n: formatNumber(dayEvents.length - 2, lng),
                    })}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-0.5 sm:hidden">
                {dayEvents.slice(0, 4).map((event) => (
                  <span
                    key={event.id}
                    className={cn(
                      "size-1.5 rounded-full",
                      categoryStyles[event.category].dot,
                    )}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
