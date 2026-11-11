import { useTranslation } from "react-i18next";
import { Inbox, Pencil, Send, Star, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

const FOLDERS = [
  { id: "inbox", icon: Inbox },
  { id: "starred", icon: Star },
  { id: "sent", icon: Send },
  { id: "trash", icon: Trash2 },
];

export default function EmailFolders({ active, unread, onChange, onCompose }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-3 p-4">
      <button
        type="button"
        onClick={onCompose}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90"
      >
        <Pencil size={16} />
        {t("email.compose")}
      </button>

      <nav
        aria-label={t("email.title")}
        className="flex gap-1 overflow-x-auto lg:flex-col"
      >
        {FOLDERS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={active === id ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active === id
                ? "bg-primary/15 text-primary"
                : "text-foreground hover:bg-hover",
            )}
          >
            <Icon size={18} />
            <span className="flex-1 text-start">
              {t(`email.folders.${id}`)}
            </span>
            {id === "inbox" && unread > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {formatNumber(unread, i18n.language)}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
