import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout.jsx";
import EcommercePage from "@/features/dashboard/pages/EcommercePage.jsx";
import FallbackPage from "@/pages/FallbackPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard/ecommerce" replace /> },
      { path: "dashboard/ecommerce", element: <EcommercePage /> },
      { path: "*", element: <FallbackPage /> },
      {
        path: "*",
        element: <p className="py-20 text-center text-muted">Coming soon</p>,
      },
    ],
  },
]);
