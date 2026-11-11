import { http } from "@/lib/http.js";

// فقط برای پر کردن خودکار فرم ورود توی دمو
export const DEMO_ACCOUNT = { email: "admin@dashly.dev", password: "admin123" };

// → { token, user }
export function signIn({ email, password }) {
  return http("/login", {
    method: "POST",
    body: { email: email.trim().toLowerCase(), password },
  });
}

// کاربر از روی توکن شناخته می‌شه، پس id لازم نیست (برای سازگاری با فرانت می‌ذاریمش)
export function updateProfile({ name, email, phone, bio }) {
  return http("/profile", {
    method: "PATCH",
    body: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      bio: bio.trim(),
    },
  });
}

export function changePassword({ currentPassword, newPassword }) {
  return http("/password", {
    method: "PUT",
    body: { current_password: currentPassword, password: newPassword },
  });
}
