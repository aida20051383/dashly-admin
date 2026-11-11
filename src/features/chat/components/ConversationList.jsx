import { useTranslation } from "react-i18next";
import { MessageSquare } from "lucide-react";
import { formatListTime } from "@/features/chat/format.js";
import { formatNumber } from "@/lib/format.js";
import { getInitials } from "@/lib/text.js";
import { cn } from "@/lib/cn.js";

export function ContactAvatar({ contact, size = "size-11" }) {
  return (
    <span className="relative shrink-0">
      <span
        className={cn(
          "grid place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary",
          size,
        )}
      >
        {getInitials(contact.name)}
      </span>
      {contact.online && (
        <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-card bg-success" />
      )}
    </span>
  );
}

export default function ConversationList({
  items,
  isPending,
  isError,
  refetch,
  selectedId,
  onSelect,
}) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;

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
        <p className="font-medium text-heading">{t("chat.error.title")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          {t("chat.error.retry")}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center p-10 text-center">
        <span className="mb-3 grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
          <MessageSquare size={24} />
        </span>
        <p className="font-medium text-heading">{t("chat.empty.title")}</p>
        <p className="mt-1 text-sm text-muted">{t("chat.empty.description")}</p>
      </div>
    );
  }

  return (
    <ul>
      {items.map(({ id, contact, last, unread }) => (
        <li key={id}>
          <button
            type="button"
            onClick={() => onSelect(id)}
            aria-current={selectedId === id ? "true" : undefined}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-start transition-colors",
              selectedId === id ? "bg-primary/10" : "hover:bg-hover",
            )}
          >
            <ContactAvatar contact={contact} />

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-heading">
                  {contact.name}
                </span>
                <span className="ms-auto shrink-0 text-xs text-muted">
                  {formatListTime(last.at, lng)}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span
                  dir="auto"
                  className={cn(
                    "truncate text-sm",
                    unread ? "font-medium text-heading" : "text-muted",
                  )}
                >
                  {last.from === "me" && `${t("chat.you")}: `}
                  {last.text}
                </span>
                {unread > 0 && (
                  <span className="ms-auto grid min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
                    {formatNumber(unread, lng)}
                  </span>
                )}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
