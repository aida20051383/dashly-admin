import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import { initialNotifications } from "./data/mockNotifications.js";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  // با localStorage ذخیره می‌شه تا بعد از رفرش هم بمونه
  const [items, setItems] = useLocalStorage(
    "notifications-v1",
    initialNotifications,
  );

  const value = useMemo(
    () => ({
      items,
      unreadCount: items.filter((n) => !n.read).length,
      markAsRead: (id) =>
        setItems((list) =>
          list.map((n) => (n.id === id ? { ...n, read: true } : n)),
        ),
      markAllAsRead: () =>
        setItems((list) => list.map((n) => ({ ...n, read: true }))),
      remove: (id) => setItems((list) => list.filter((n) => n.id !== id)),
    }),
    [items, setItems],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside <NotificationsProvider>",
    );
  return ctx;
}
