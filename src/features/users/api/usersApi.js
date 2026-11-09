import { normalizeText } from "@/lib/text.js";
import { ApiError } from "@/lib/ApiError.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DAY = 24 * 60 * 60 * 1000;
const BASE = Date.UTC(2026, 10, 1);

export const ROLES = ["admin", "editor", "author", "maintainer", "subscriber"];
export const STATUSES = ["active", "pending", "inactive"];

const FIRST = [
  "Liam",
  "Olivia",
  "Noah",
  "Emma",
  "Ethan",
  "Sophia",
  "Lucas",
  "Mia",
  "Mason",
  "Amelia",
  "Leo",
  "Nora",
  "Omid",
  "Sara",
  "Arman",
  "Mina",
];
const LAST = [
  "Walker",
  "Hughes",
  "Bennett",
  "Carter",
  "Moore",
  "Reed",
  "Foster",
  "Brooks",
  "Kaya",
  "Rahimi",
];

// با let تعریف شده تا توی قدم بعد بشه اضافه/ویرایش/حذف کرد
let users = Array.from({ length: 53 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 3 + 1) % LAST.length];
  return {
    id: i + 1,
    name: `${first} ${last}`,
    email: `${first}.${last}${i + 1}@example.com`.toLowerCase(),
    role: ROLES[(i * 2 + 1) % ROLES.length],
    status: i % 7 === 0 ? "inactive" : i % 4 === 0 ? "pending" : "active",
    joinedAt: BASE - ((i * 37) % 400) * DAY,
  };
});

export async function getUsers({
  page = 1,
  pageSize = 10,
  search = "",
  role = "all",
  status = "all",
  sortBy = "joinedAt",
  sortDir = "desc",
} = {}) {
  await delay(500);

  const q = normalizeText(search);
  const filtered = users.filter(
    (u) =>
      (role === "all" || u.role === role) &&
      (status === "all" || u.status === status) &&
      (!q || normalizeText(`${u.name} ${u.email}`).includes(q)),
  );

  const direction = sortDir === "asc" ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    const result = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return (result || a.id - b.id) * direction;
  });

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(page, 1), pageCount);
  const start = (current - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    total,
    page: current,
    pageSize,
    pageCount,
  };
}
const normalizeEmail = (email) => email.trim().toLowerCase();

const isEmailTaken = (email, exceptId) =>
  users.some((u) => u.email === email && u.id !== exceptId);

export async function createUser({ name, email, role, status }) {
  await delay(600);

  const normalized = normalizeEmail(email);
  if (isEmailTaken(normalized)) throw new ApiError("EMAIL_TAKEN");

  const user = {
    id: Math.max(0, ...users.map((u) => u.id)) + 1,
    name: name.trim(),
    email: normalized,
    role,
    status,
    joinedAt: Date.now(),
  };

  // اول لیست، تا کاربر جدید همون لحظه دیده بشه
  users = [user, ...users];
  return user;
}

export async function updateUser({ id, name, email, role, status }) {
  await delay(600);

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new ApiError("NOT_FOUND");

  const normalized = normalizeEmail(email);
  if (isEmailTaken(normalized, id)) throw new ApiError("EMAIL_TAKEN");

  const updated = {
    ...users[index],
    name: name.trim(),
    email: normalized,
    role,
    status,
  };
  users = users.map((u) => (u.id === id ? updated : u));
  return updated;
}

export async function deleteUser(id) {
  await delay(500);

  if (!users.some((u) => u.id === id)) throw new ApiError("NOT_FOUND");

  users = users.filter((u) => u.id !== id);
  return { id };
}
