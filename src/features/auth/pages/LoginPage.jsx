import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Moon, Sun, TriangleAlert } from "lucide-react";
import Logo from "@/components/ui/Logo.jsx";
import IconButton from "@/components/ui/IconButton.jsx";
import LanguageMenu from "@/components/layout/LanguageMenu.jsx";
import AuthHero from "@/features/auth/components/AuthHero.jsx";
import { useAuth } from "@/features/auth/AuthContext.jsx";
import { DEMO_ACCOUNT } from "@/features/auth/api/authApi.js";
import { useTheme } from "@/app/ThemeProvider.jsx";
import { cn } from "@/lib/cn.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "h-11 w-full rounded-lg border bg-transparent px-3 text-heading outline-none transition-colors focus:border-primary";

export default function LoginPage() {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // بعد از موفقیت، GuestOnly خودش به صفحه‌ی مقصد می‌فرسته
  const mutation = useMutation({ mutationFn: login });

  const emailError =
    submitted && !emailPattern.test(email.trim())
      ? t("auth.errors.email")
      : null;
  const passwordError =
    submitted && !password ? t("auth.errors.password") : null;

  const invalidCredentials = mutation.error?.code === "INVALID_CREDENTIALS";
  const formError = mutation.isError
    ? t(invalidCredentials ? "auth.errors.invalid" : "auth.errors.generic")
    : null;

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!emailPattern.test(email.trim()) || !password) return;
    mutation.mutate({ email, password, remember });
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    mutation.reset();
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthHero />

      <main className="relative grid place-items-center p-6">
        <div className="absolute end-4 top-4 flex items-center gap-1">
          <LanguageMenu />
          <IconButton
            label={isDark ? t("navbar.lightMode") : t("navbar.darkMode")}
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </IconButton>
        </div>

        <div className="w-full max-w-sm">
          <Logo className="mb-8 lg:hidden" />

          <h1 className="text-2xl font-bold text-heading">
            {t("auth.welcome")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("auth.subtitle")}</p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            {formError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2.5 text-sm text-danger"
              >
                <TriangleAlert size={16} className="shrink-0" />
                {formError}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-heading"
              >
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (mutation.isError) mutation.reset();
                }}
                aria-invalid={Boolean(emailError)}
                className={cn(
                  inputClass,
                  emailError ? "border-danger" : "border-border",
                )}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-danger">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-heading"
              >
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (mutation.isError) mutation.reset();
                  }}
                  aria-invalid={Boolean(passwordError)}
                  className={cn(
                    inputClass,
                    "pe-11",
                    passwordError ? "border-danger" : "border-border",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword
                      ? t("auth.hidePassword")
                      : t("auth.showPassword")
                  }
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-heading"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-danger">{passwordError}</p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 accent-primary"
              />
              {t("auth.remember")}
            </label>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-11 w-full rounded-lg bg-primary text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
            >
              {mutation.isPending ? t("auth.signingIn") : t("auth.signIn")}
            </button>
          </form>

          {/* حساب نمایشی */}
          <div className="mt-8 flex items-center justify-between gap-3 rounded-lg border border-dashed border-border p-3 text-sm">
            <div className="min-w-0">
              <p className="font-medium text-heading">{t("auth.demo.title")}</p>
              <p className="mt-0.5 truncate text-xs text-muted">
                <bdi dir="ltr">
                  {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
                </bdi>
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {t("auth.demo.fill")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
