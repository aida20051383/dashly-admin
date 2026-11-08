import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CornerDownLeft,
  Languages,
  Moon,
  Search,
  SearchX,
  Sun,
} from "lucide-react";
import IconButton from "@/components/ui/IconButton.jsx";
import { useTheme } from "@/app/ThemeProvider.jsx";
import { getPageEntries } from "@/features/search/pageEntries.js";
import { normalizeText } from "@/lib/text.js";
import { cn } from "@/lib/cn.js";

export default function SearchMenu() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const lng = i18n.language;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  const close = () => setOpen(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyK") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const entries = useMemo(() => {
    const tEn = i18n.getFixedT("en");
    const tFa = i18n.getFixedT("fa");

    const build = (entry) => ({
      ...entry,
      label: t(entry.labelKey),
      haystack: normalizeText(
        `${tEn(entry.labelKey)} ${tFa(entry.labelKey)} ${entry.keywords ?? ""}`,
      ),
    });

    const pages = getPageEntries().map((p) =>
      build({ ...p, group: "pages", run: () => navigate(p.to) }),
    );

    const actions = [
      build({
        id: "toggle-theme",
        group: "actions",
        icon: isDark ? Sun : Moon,
        labelKey: isDark ? "navbar.lightMode" : "navbar.darkMode",
        keywords: "theme dark light mode تم تیره روشن",
        run: toggleTheme,
      }),
      build({
        id: "switch-language",
        group: "actions",
        icon: Languages,
        labelKey: "search.switchLanguage",
        keywords: "language persian english farsi زبان فارسی انگلیسی",
        run: () => i18n.changeLanguage(lng === "fa" ? "en" : "fa"),
      }),
    ];

    return [...pages, ...actions];
  }, [t, i18n, lng, isDark, navigate, toggleTheme]);

  const results = useMemo(() => {
    const q = normalizeText(query);
    return q ? entries.filter((e) => e.haystack.includes(q)) : entries;
  }, [entries, query]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const choose = (entry) => {
    close();
    entry.run();
  };

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) choose(results[activeIndex]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <>
      <IconButton
        label={`${t("navbar.search")} (Ctrl/⌘ K)`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <Search size={22} />
      </IconButton>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh]"
            onMouseDown={close}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t("search.title")}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-card"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search size={20} className="shrink-0 text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder={t("search.placeholder")}
                  aria-label={t("search.title")}
                  className="h-14 flex-1 bg-transparent text-heading outline-none placeholder:text-muted"
                />
                <kbd className="rounded-md border border-border px-1.5 py-0.5 text-xs text-muted">
                  Esc
                </kbd>
              </div>

              {results.length === 0 ? (
                <div className="grid place-items-center px-6 py-12 text-center">
                  <SearchX size={32} className="mb-3 text-muted" />
                  <p className="font-medium text-heading">
                    {t("search.noResults", { q: query })}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {t("search.noResultsHint")}
                  </p>
                </div>
              ) : (
                <ul
                  ref={listRef}
                  role="listbox"
                  className="max-h-80 overflow-y-auto p-2"
                >
                  {results.map((entry, i) => {
                    const Icon = entry.icon;
                    const isActive = i === activeIndex;
                    const newGroup =
                      i === 0 || results[i - 1].group !== entry.group;
                    return (
                      <li key={entry.id}>
                        {newGroup && (
                          <p className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wider text-muted">
                            {t(`search.groups.${entry.group}`)}
                          </p>
                        )}
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive}
                          onMouseEnter={() => setActive(i)}
                          onClick={() => choose(entry)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground",
                          )}
                        >
                          <Icon size={18} className="shrink-0" />
                          <span className="flex-1 truncate">{entry.label}</span>
                          {entry.to && (
                            <span dir="ltr" className="text-xs text-muted">
                              {entry.to}
                            </span>
                          )}
                          {isActive && (
                            <CornerDownLeft size={14} className="shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-border px-1">↑</kbd>
                  <kbd className="rounded border border-border px-1">↓</kbd>
                  {t("search.navigate")}
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-border px-1">↵</kbd>
                  {t("search.select")}
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-border px-1">Esc</kbd>
                  {t("search.close")}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
