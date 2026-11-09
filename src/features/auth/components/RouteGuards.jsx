import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext.jsx";

/** فقط برای وارد‌شده‌ها؛ بقیه به /login می‌رن و صفحه‌ی مقصد یادشون می‌مونه */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** فقط برای مهمان‌ها؛ وارد‌شده‌ها دیگه صفحه‌ی لاگین رو نمی‌بینن */
export function GuestOnly() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from;
    return <Navigate to={from ? from.pathname + from.search : "/"} replace />;
  }
  return <Outlet />;
}
