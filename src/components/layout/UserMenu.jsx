import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, Settings, User } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import { useAuth } from "@/features/auth/AuthContext.jsx";
import { useToast } from "@/app/ToastProvider.jsx";
import { getInitials } from "@/lib/text.js";
import { cn } from "@/lib/cn.js";

const itemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-hover hover:text-primary";

export default function UserMenu() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const toast = useToast();

  const name = user?.name ?? "";
  const role = t(`users.roles.${user?.role ?? "subscriber"}`);
  const initials = getInitials(name);

  const signOut = (close) => {
    close();
    logout(); // RequireAuth خودش به /login می‌فرسته
    toast.success(t("auth.signedOut"));
  };

  return (
    <Dropdown
      className="w-64 p-2"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
          className="ms-2 flex items-center gap-3 rounded-full py-1 ps-3 pe-1 transition-colors hover:bg-hover"
        >
          <div className="hidden text-end sm:block">
            <p className="text-sm font-medium leading-tight text-heading">
              {name}
            </p>
            <p className="text-xs text-muted">{role}</p>
          </div>
          <Avatar initials={initials} online />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center gap-3 border-b border-border px-3 pb-3 pt-2">
            <Avatar initials={initials} online />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-heading">
                {name}
              </p>
              <p className="text-xs text-muted">{role}</p>
            </div>
          </div>

          <div role="menu" className="pt-2">
            <Link
              to="/profile"
              onClick={close}
              role="menuitem"
              className={itemClass}
            >
              <User size={18} />
              {t("navbar.profile")}
            </Link>
            <Link
              to="/settings"
              onClick={close}
              role="menuitem"
              className={itemClass}
            >
              <Settings size={18} />
              {t("nav.settings")}
            </Link>

            <div className="my-2 border-t border-border" />

            <button
              type="button"
              onClick={() => signOut(close)}
              role="menuitem"
              className={cn(itemClass, "hover:bg-danger/10 hover:text-danger")}
            >
              <LogOut size={18} />
              {t("navbar.signOut")}
            </button>
          </div>
        </>
      )}
    </Dropdown>
  );
}
