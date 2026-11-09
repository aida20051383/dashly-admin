import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/vazirmatn";
import "@/styles/index.css";
import "@/i18n/index.js";
import { queryClient } from "@/lib/queryClient.js";
import { ThemeProvider } from "@/app/ThemeProvider.jsx";
import { NotificationsProvider } from "@/features/notifications/NotificationsContext.jsx";
import { CartProvider } from "@/features/cart/CartContext.jsx";
import { router } from "@/app/router.jsx";
import { ToastProvider } from "@/app/ToastProvider.jsx";
import { AuthProvider } from "@/features/auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <NotificationsProvider>
              <CartProvider>
                <RouterProvider router={router} />
              </CartProvider>
            </NotificationsProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
