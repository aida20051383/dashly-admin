import { http } from "@/lib/http.js";

// بک‌اند createdAt می‌فرسته، جدول کاربران joinedAt می‌خواد
const toUser = (user) => ({ ...user, joinedAt: user.createdAt });

// فیلتر «همه» رو به بک‌اند نمی‌فرستیم
const clean = (value) => (value === "all" ? undefined : value);

export const ROLES = ["admin", "editor", "author", "maintainer", "subscriber"];
export const STATUSES = ["active", "pending", "inactive"];

export async function getUsers({
  page,
  pageSize,
  search,
  role,
  status,
  sortBy,
  sortDir,
} = {}) {
  const data = await http("/users", {
    params: {
      page,
      pageSize,
      search: search?.trim(),
      role: clean(role),
      status: clean(status),
      sortBy,
      sortDir,
    },
  });
  return { ...data, items: data.items.map(toUser) };
}

export async function createUser({ name, email, role, status }) {
  const user = await http("/users", {
    method: "POST",
    body: { name, email, role, status },
  });
  return toUser(user);
}

export async function updateUser({ id, name, email, role, status }) {
  const user = await http(`/users/${id}`, {
    method: "PATCH",
    body: { name, email, role, status },
  });
  return toUser(user);
}

export async function deleteUser(id) {
  await http(`/users/${id}`, { method: "DELETE" });
  return { id };
}
