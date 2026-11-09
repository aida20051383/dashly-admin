import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { signIn } from "@/features/auth/api/authApi.js";

const KEY = "auth-session";
const AuthContext = createContext(null);

// «مرا به خاطر بسپار» ← localStorage | وگرنه ← sessionStorage (با بستن تب پاک می‌شه)
function readSession() {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session, remember) {
  try {
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(KEY);
    target.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }
}

// نشست رو همون‌جا که هست (local یا session) دوباره می‌نویسه
function persistSession(session) {
  try {
    const storage =
      localStorage.getItem(KEY) !== null ? localStorage : sessionStorage;
    storage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }
}

function clearSession() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(readSession);

  const login = useCallback(
    async ({ email, password, remember }) => {
      const result = await signIn({ email, password });
      queryClient.clear(); // کش کاربر قبلی نمونه
      writeSession(result, remember);
      setSession(result);
      return result.user;
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  // بعد از ویرایش پروفایل، کاربر جدید رو توی نشست بذار
  const updateUser = useCallback(
    (user) => {
      if (!session) return;
      const next = { ...session, user };
      persistSession(next);
      setSession(next);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      login,
      logout,
      updateUser,
    }),
    [session, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
