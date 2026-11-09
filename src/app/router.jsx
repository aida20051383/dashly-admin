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
        ],
      },
    ],
  },
]);
