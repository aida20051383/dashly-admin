import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Circle,
  CircleDot,
  Ellipsis,
  LayoutDashboard,
  X,
} from "lucide-react";
import { navigation } from "@/config/navigation.js";
import { cn } from "@/lib/cn.js";
import Logo from "@/components/ui/Logo.jsx";

const itemBase =
  "flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors";
const activeItem =
  "bg-linear-to-r rtl:bg-linear-to-l from-primary to-primary/70 text-white shadow-glow";

function CountBadge({ children }) {
  return (
    <span className="grid size-5 place-items-center rounded-full bg-warning/20 text-xs font-semibold text-warning">
      {children}
    </span>
  );
}

function NavItem({ item, expanded }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const label = t(item.labelKey);

  return (
    <li>
      <NavLink
        to={item.to}
        title={label}
        className={({ isActive }) =>
          cn(
            itemBase,
            !expanded && "justify-center",
            isActive ? activeItem : "text-foreground hover:bg-hover",
          )
        }
      >
        <Icon size={20} className="shrink-0" />
        {expanded && <span className="truncate">{label}</span>}
      </NavLink>
    </li>
  );
}

function NavGroup({ item, expanded }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const childActive = item.children.some((c) => pathname.startsWith(c.to));
  const [open, setOpen] = useState(childActive);
  const Icon = item.icon;
  const label = t(item.labelKey);

  return (
    <li>
      <button
        type="button"
        title={label}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          itemBase,
          expanded ? "justify-between" : "justify-center",
          childActive
            ? "bg-hover text-heading"
            : "text-foreground hover:bg-hover",
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          <Icon size={20} className="shrink-0" />
          {expanded && <span className="truncate">{label}</span>}
        </span>
        {expanded && (
          <span className="flex items-center gap-2">
            {item.badge ? <CountBadge>{item.badge}</CountBadge> : null}
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform",
                !open && "-rotate-90 rtl:rotate-90",
              )}
            />
          </span>
        )}
      </button>

      {expanded && open && (
        <ul className="mt-1 space-y-1">
          {item.children.map((child) => (
            <li key={child.to}>
              <NavLink
                to={child.to}
                className={({ isActive }) =>
                  cn(
                    itemBase,
                    "ps-4",
                    isActive ? activeItem : "text-foreground hover:bg-hover",
                  )
                }
              >
                <Circle size={8} className="shrink-0" />
                <span className="truncate">{t(child.labelKey)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Sidebar({
  pinned,
  onTogglePin,
  mobileOpen,
  onCloseMobile,
}) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered || mobileOpen;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "fixed inset-y-0 start-0 z-40 flex flex-col overflow-hidden bg-card",
        "transition-[width,transform] duration-200 ease-out",
        expanded ? "w-[17rem]" : "w-20",
        "max-lg:w-[17rem]",
        mobileOpen
          ? "max-lg:translate-x-0"
          : "max-lg:-translate-x-full rtl:max-lg:translate-x-full",
        expanded && !pinned && "shadow-card",
      )}
    >
      <div
        className={cn(
          "flex h-[4.5rem] shrink-0 items-center px-5",
          expanded ? "justify-between" : "justify-center",
        )}
      >
        <Link to="/" aria-label="Dashly">
          <Logo showText={expanded} />
        </Link>

        {expanded && (
          <>
            <button
              type="button"
              onClick={onTogglePin}
              aria-label={pinned ? t("navbar.unpin") : t("navbar.pin")}
              title={pinned ? t("navbar.unpin") : t("navbar.pin")}
              className="hidden text-primary lg:block"
            >
              {pinned ? <CircleDot size={20} /> : <Circle size={20} />}
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label={t("navbar.closeMenu")}
              className="text-foreground lg:hidden"
            >
              <X size={20} />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6">
        {navigation.map((section, i) => (
          <div key={section.titleKey ?? i}>
            {section.titleKey &&
              (expanded ? (
                <p className="px-3.5 pb-2 pt-6 text-xs font-medium uppercase tracking-wider text-muted">
                  {t(section.titleKey)}
                </p>
              ) : (
                <div className="flex justify-center py-5 text-muted">
                  <Ellipsis size={18} />
                </div>
              ))}
            <ul className={cn("space-y-1", i === 0 && "pt-2")}>
              {section.items.map((item) =>
                item.children ? (
                  <NavGroup
                    key={item.labelKey}
                    item={item}
                    expanded={expanded}
                  />
                ) : (
                  <NavItem key={item.to} item={item} expanded={expanded} />
                ),
              )}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
