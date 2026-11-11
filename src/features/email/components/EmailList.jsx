import { useTranslation } from "react-i18next";
import { Mail, Star } from "lucide-react";
import { formatStamp } from "@/features/email/format.js";
import { getInitials } from "@/lib/text.js";
import { cn } from "@/lib/cn.js";

export default function EmailList({
  items,
  isPending,
  isError,
  refetch,
  folder,
  selectedId,
  onSelect,
  onToggleStar,
}) {
  const { t, i18n } = useTranslation();

  if (isPending) {
    return (
      <ul aria-hidden="true" className="divide-y divide-border">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="px-4 py-4">
            <div className="h-12 animate-pulse rounded-md bg-hover" />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="p-10 text-center">
        <p className="font-medium text-heading">{t("email.error.title")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          {t("email.error.retry")}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center p-10 text-center">
        <span className="mb-3 grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
          <Mail size={24} />
        </span>
        <p className="font-medium text-heading">{t("email.empty.title")}</p>
        <p className="mt-1 text-sm text-muted">
          {t("email.empty.description")}
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((email) => {
        const unread = !email.read;
        const name =
          folder === "sent" ? `${t("email.to")}: ${email.to}` : email.from.name;

        return (
          <li
            key={email.id}
            className={cn(
              "flex items-start gap-1 pe-3 ps-1",
              selectedId === email.id ? "bg-primary/10" : "hover:bg-hover",
            )}
          >
            <button
              type="button"
              onClick={() => onToggleStar(email.id)}
              aria-label={
                email.starred
                  ? t("email.actions.unstar")
                  : t("email.actions.star")
              }
              aria-pressed={email.starred}
              className={cn(
                "mt-3 grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-hover",
                email.starred ? "text-warning" : "text-muted",
              )}
            >
              <Star size={17} fill={email.starred ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={() => onSelect(email)}
              className="flex min-w-0 flex-1 items-start gap-3 py-3 text-start"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {getInitials(email.from.name)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-sm",
                      unread
                        ? "font-bold text-heading"
                        : "font-medium text-heading",
                    )}
                  >
                    {name}
                  </span>
                  <span className="ms-auto shrink-0 text-xs text-muted">
                    {formatStamp(email.date, i18n.language)}
                  </span>
                </span>
                <span
                  className={cn(
                    "block truncate text-sm",
                    unread ? "font-semibold text-heading" : "text-foreground",
                  )}
                >
                  {email.subject}
                </span>
                <span className="block truncate text-xs text-muted">
                  {email.body.replace(/\s+/g, " ")}
                </span>
              </span>

              {unread && (
                <span
                  aria-hidden="true"
                  className="mt-2 size-2.5 shrink-0 rounded-full bg-primary"
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
