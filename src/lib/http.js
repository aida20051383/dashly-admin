import { ApiError } from "@/lib/ApiError.js";

const BASE_URL = import.meta.env.VITE_API_URL;
const SESSION_KEY = "auth-session"; // همون کلید AuthContext

function readToken() {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw).token ?? null) : null;
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

function toQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, value);
    }
  });
  const text = qs.toString();
  return text ? `?${text}` : "";
}

export async function http(path, { method = "GET", body, params } = {}) {
  const token = readToken();

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}${toQuery(params)}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("NETWORK_ERROR"); // بک‌اند خاموشه یا اینترنت نیست
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (response.ok) return data;

  // توکن منقضی/نامعتبر: نشست رو پاک کن، RouteGuards خودش می‌بره به صفحه‌ی ورود
  if (response.status === 401 && token) {
    clearSession();
    window.location.reload();
  }

  // بک‌اند ما {code, message} می‌فرسته؛ بقیه‌ی خطاها کد پیش‌فرض می‌گیرن
  const code =
    data?.code ??
    (response.status === 401
      ? "UNAUTHENTICATED"
      : response.status === 403
        ? "FORBIDDEN"
        : response.status === 422
          ? "VALIDATION_ERROR"
          : response.status === 429
            ? "TOO_MANY_REQUESTS"
            : "SERVER_ERROR");

  throw new ApiError(code, response.status);
}
