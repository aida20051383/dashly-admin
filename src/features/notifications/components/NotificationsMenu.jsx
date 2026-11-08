import { useTranslation } from "react-i18next";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  CreditCard,
  ShoppingBag,
  TriangleAlert,
  UserPlus,
  X,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown.jsx";
import IconButton from "@/components/ui/IconButton.jsx";
import { useNotifications } from "@/features/notifications/NotificationsContext.jsx";
import { formatNumber, formatRelativeTime } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

// آیکون و رنگ هر نوع اعلان
const typeStyle = {
  order: { icon: ShoppingBag, tone: "bg-success/15 text-success" },
  user: { icon: UserPlus, tone: "bg-primary/15 text-primary" },
  payment: { icon: CreditCard, tone: "bg-warning/15 text-warning" },
  system: { icon: TriangleAlert, tone: "bg-danger/15 text-danger" },
};

export default function NotificationsMenu() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const { items, unreadCount, markAsRead, markAllAsRead, remove } =
    useNotifications();

  const badge =
    unreadCount > 9
      ? `${formatNumber(9, lng)}+`
      : unreadCount
        ? formatNumber(unreadCount, lng)
        : 0;

  return (
    <Dropdown
      className="w-[22rem] max-w-[calc(100vw-2rem)]"
      trigger={({ open, toggle }) => (
        <IconButton
          label={t("navbar.notifications")}
          badge={badge}
          badgeTone="danger"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Bell size={22} />
        </IconButton>
      )}
    >
      {/* سربرگ */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-heading">
            {t("notifications.title")}
          </h3>
          {unreadCount > 0 && (
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
              {t("notifications.newCount", {
                n: formatNumber(unreadCount, lng),
              })}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          aria-label={t("notifications.markAllRead")}
          title={t("notifications.markAllRead")}
          className="grid size-8 place-items-center rounded-full text-foreground transition-colors hover:bg-hover hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <CheckCheck size={18} />
        </button>
      </div>

      {/* لیست یا حالت خالی */}
      {items.length === 0 ? (
        <div className="grid place-items-center px-6 py-12 text-center">
          <BellOff size={32} className="mb-3 text-muted" />
          <p className="font-medium text-heading">{t("notifications.empty")}</p>
          <p className="mt-1 text-sm text-muted">
            {t("notifications.emptyHint")}
          </p>
        </div>
      ) : (
        <ul className="max-h-96 divide-y divide-border overflow-y-auto">
          {items.map((n) => {
            const { icon: Icon, tone } = typeStyle[n.type] ?? typeStyle.system;
            return (
              <li
                key={n.id}
                className={cn(
                  "group flex gap-3 px-4 py-3 transition-colors hover:bg-hover",
                  !n.read && "bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full",
                    tone,
                  )}
                >
                  <Icon size={18} />
                </span>

                <button
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className="min-w-0 flex-1 text-start"
                >
                  <p
                    className={cn(
                      "text-sm text-heading",
                      n.read ? "font-medium" : "font-semibold",
                    )}
                  >
                    {t(n.titleKey)}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm">
                    {t(n.bodyKey, n.values)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatRelativeTime(n.createdAt, lng)}
                  </p>
                </button>

                <div className="flex shrink-0 flex-col items-center justify-between gap-2">
                  {!n.read ? (
                    <span
                      className="mt-1 size-2.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    <Check
                      size={14}
                      className="mt-1 text-muted"
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => remove(n.id)}
                    aria-label={t("notifications.remove")}
                    title={t("notifications.remove")}
                    className="grid size-6 place-items-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Dropdown>
  );
}
