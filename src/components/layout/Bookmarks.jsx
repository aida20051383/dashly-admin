import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import IconButton from "@/components/ui/IconButton.jsx";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import { getPageEntries } from "@/features/search/pageEntries.js";
import { cn } from "@/lib/cn.js";

const DEFAULTS = ["/apps/email", "/apps/chat", "/apps/todo", "/apps/calendar"];
const MAX = 6;

export default function Bookmarks() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [paths, setPaths] = useLocalStorage("bookmarks-v1", DEFAULTS);

  const pages = useMemo(
    () => new Map(getPageEntries().map((p) => [p.to, p])),
    [],
  );

  const canBookmark = pages.has(pathname);
  const saved = paths.includes(pathname);
  const full = paths.length >= MAX;

  const toggle = () =>
    setPaths((list) => {
      if (list.includes(pathname)) return list.filter((p) => p !== pathname);
      return list.length >= MAX ? list : [...list, pathname];
    });

  const starLabel = !canBookmark
    ? t("bookmarks.unavailable")
    : saved
      ? t("bookmarks.remove")
      : full
        ? t("bookmarks.full")
        : t("bookmarks.add");

  return (
    <div className="hidden items-center gap-1 md:flex">
      {paths
        .map((to) => pages.get(to))
        .filter(Boolean)
        .map(({ to, labelKey, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={t(labelKey)}
            title={t(labelKey)}
            className={cn(
              "grid size-10 place-items-center rounded-full transition-colors hover:bg-hover hover:text-primary",
              pathname === to ? "text-primary" : "text-foreground",
            )}
          >
            <Icon size={22} />
          </Link>
        ))}

      <IconButton
        label={starLabel}
        onClick={toggle}
        disabled={!canBookmark || (!saved && full)}
        aria-pressed={saved}
        className="text-warning hover:text-warning disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <Star size={22} className={saved ? "fill-current" : ""} />
      </IconButton>
    </div>
  );
}
