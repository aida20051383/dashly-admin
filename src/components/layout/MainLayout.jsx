import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar.jsx";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import { cn } from "@/lib/cn.js";
import Navbar from "@/components/layout/Navbar.jsx";

export default function MainLayout() {
  const [pinned, setPinned] = useLocalStorage("sidebar-pinned", false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <Sidebar
        pinned={pinned}
        onTogglePin={() => setPinned((p) => !p)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "transition-[padding] duration-200",
          pinned ? "lg:ps-[17rem]" : "lg:ps-20",
        )}
      >
        <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6">
          <Navbar onOpenMenu={() => setMobileOpen(true)} />
          <main className="pt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
