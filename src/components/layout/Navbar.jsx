import { useTranslation } from "react-i18next";
import { Menu, Moon, Sun } from "lucide-react";
import IconButton from "@/components/ui/IconButton.jsx";
import Bookmarks from "@/components/layout/Bookmarks.jsx";
import LanguageMenu from "@/components/layout/LanguageMenu.jsx";
import UserMenu from "@/components/layout/UserMenu.jsx";
import SearchMenu from "@/features/search/components/SearchMenu.jsx";
import CartMenu from "@/features/cart/components/CartMenu.jsx";
import NotificationsMenu from "@/features/notifications/components/NotificationsMenu.jsx";
import { useTheme } from "@/app/ThemeProvider.jsx";

export default function Navbar({ onOpenMenu }) {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-4 z-20 mt-4 flex h-[4.5rem] items-center gap-1 rounded-xl bg-card px-4 shadow-card">
      <IconButton
        label={t("navbar.openMenu")}
        onClick={onOpenMenu}
        className="lg:hidden"
      >
        <Menu size={22} />
      </IconButton>

      <Bookmarks />

      <div className="ms-auto flex items-center gap-1">
        <LanguageMenu />
        <IconButton
          label={isDark ? t("navbar.lightMode") : t("navbar.darkMode")}
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </IconButton>
        <SearchMenu />
        <CartMenu />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
