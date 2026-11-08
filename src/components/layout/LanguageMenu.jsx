import { useTranslation } from "react-i18next";
import { Check, Languages } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown.jsx";
import { cn } from "@/lib/cn.js";

const languages = [
  { code: "en", label: "English" },
  { code: "fa", label: "فارسی" },
];

export default function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const current =
    languages.find((l) => l.code === i18n.language) ?? languages[0];

  return (
    <Dropdown
      className="w-44 p-2"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={t("navbar.language")}
          title={t("navbar.language")}
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-foreground transition-colors hover:bg-hover"
        >
          <Languages size={20} />
          <span className="hidden sm:inline">{current.label}</span>
        </button>
      )}
    >
      {({ close }) => (
        <div role="menu">
          {languages.map(({ code, label }) => {
            const isCurrent = code === current.code;
            return (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={isCurrent}
                lang={code}
                onClick={() => {
                  i18n.changeLanguage(code);
                  close();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-hover",
                  isCurrent ? "text-primary" : "text-foreground",
                )}
              >
                {label}
                {isCurrent && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </Dropdown>
  );
}
