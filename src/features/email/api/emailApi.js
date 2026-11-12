import { http } from "@/lib/http.js";

// → { items, counts: { inboxUnread } }
export function getEmails({ folder = "inbox", search = "" } = {}) {
  return http("/emails", { params: { folder, search: search.trim() } });
}

export function getEmail(id) {
  return http(`/emails/${id}`);
}

// → { id }
export function markRead({ id, read }) {
  return http(`/emails/${id}/read`, { method: "PATCH", body: { read } });
}

export function toggleStar(id) {
  return http(`/emails/${id}/star`, { method: "PATCH" });
}

export function trashEmail(id) {
  return http(`/emails/${id}/trash`, { method: "PATCH" });
}

export function restoreEmail(id) {
  return http(`/emails/${id}/restore`, { method: "PATCH" });
}

export async function deleteEmail(id) {
  await http(`/emails/${id}`, { method: "DELETE" });
  return { id };
}

export function sendEmail({ to, subject, body }) {
  return http("/emails", {
    method: "POST",
    body: { to: to.trim(), subject, body },
  });
}
