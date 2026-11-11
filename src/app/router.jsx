import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout.jsx";
import EcommercePage from "@/features/dashboard/pages/EcommercePage.jsx";
import UsersPage from "@/features/users/pages/UsersPage.jsx";
import LoginPage from "@/features/auth/pages/LoginPage.jsx";
import {
  GuestOnly,
  RequireAuth,
} from "@/features/auth/components/RouteGuards.jsx";
import FallbackPage from "@/pages/FallbackPage.jsx";
import ProfilePage from "@/features/profile/pages/ProfilePage.jsx";
import SettingsPage from "@/features/settings/pages/SettingsPage.jsx";
import TodoPage from "@/features/todo/pages/TodoPage.jsx";
import CalendarPage from "@/features/calendar/pages/CalendarPage.jsx";
import EmailPage from "@/features/email/pages/EmailPage.jsx";
import ChatPage from "@/features/chat/pages/ChatPage.jsx";
import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage.jsx";

export const router = createBrowserRouter([
  // مهمان‌ها
  {
    element: <GuestOnly />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },

  // وارد‌شده‌ها
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/ecommerce" replace />,
          },
          { path: "dashboard/ecommerce", element: <EcommercePage /> },
          { path: "users", element: <UsersPage /> },
          { path: "*", element: <FallbackPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "apps/todo", element: <TodoPage /> },
          { path: "apps/calendar", element: <CalendarPage /> },
          { path: "apps/email", element: <EmailPage /> },
          { path: "apps/chat", element: <ChatPage /> },
          { path: "dashboard/analytics", element: <AnalyticsPage /> },
        ],
      },
    ],
  },
]);
