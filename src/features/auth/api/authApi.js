import { ApiError } from "@/lib/ApiError.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// فقط برای دمو! توی پروژه‌ی واقعی اعتبارسنجی سمت سرور انجام می‌شه
export const DEMO_ACCOUNT = { email: "admin@dashly.dev", password: "admin123" };

const accounts = [
  {
    id: 1,
    name: "John Doe",
    role: "admin",
    phone: "+1 555 010 2030",
    bio: "Store owner and dashboard admin.",
    createdAt: Date.UTC(2025, 5, 12),
    ...DEMO_ACCOUNT,
  },
  {
    id: 2,
    name: "Sara Ahmadi",
    role: "editor",
    phone: "",
    bio: "",
    createdAt: Date.UTC(2025, 8, 3),
    email: "sara@dashly.dev",
    password: "sara12345",
  },
];

// رمز هیچ‌وقت به کلاینت برنمی‌گرده
const toUser = (account) => {
  const { password: _password, ...user } = account;
  return user;
};

export async function signIn({ email, password }) {
  await delay(700);

  const account = accounts.find(
    (a) => a.email === email.trim().toLowerCase() && a.password === password,
  );
  if (!account) throw new ApiError("INVALID_CREDENTIALS");

  return {
    token: `mock-token-${account.id}-${Date.now()}`,
    user: toUser(account),
  };
}

export async function updateProfile({ id, name, email, phone, bio }) {
  await delay(600);

  const account = accounts.find((a) => a.id === id);
  if (!account) throw new ApiError("NOT_FOUND");

  const normalized = email.trim().toLowerCase();
  if (accounts.some((a) => a.email === normalized && a.id !== id))
    throw new ApiError("EMAIL_TAKEN");

  Object.assign(account, {
    name: name.trim(),
    email: normalized,
    phone: phone.trim(),
    bio: bio.trim(),
  });
  return toUser(account);
}

export async function changePassword({ id, currentPassword, newPassword }) {
  await delay(700);

  const account = accounts.find((a) => a.id === id);
  if (!account) throw new ApiError("NOT_FOUND");
  if (account.password !== currentPassword)
    throw new ApiError("INVALID_PASSWORD");

  account.password = newPassword;
  return { ok: true };
}
