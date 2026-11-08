import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown.jsx";
import { formatYear } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

export default function YearSelect({ years, value, onChange }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;

  return (
    <Dropdown
      align="start"
      className="min-w-28 p-1.5"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t("dashboard.revenue.year")}
          className="flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          {formatYear(value, lng)}
          <ChevronDown size={16} />
        </button>
      )}
    >
      {({ close }) => (
        <ul role="listbox">
          {years.map((year) => {
            const selected = year === value;
            return (
              <li key={year}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(year);
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-hover",
                    selected ? "text-primary" : "text-foreground",
                  )}
                >
                  {formatYear(year, lng)}
                  {selected && <Check size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Dropdown>
  );
}
