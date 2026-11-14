import { http } from "@/lib/http.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// -> { items, totalUnread }
export function getConversations({ search = "" } = {}) {
  return http("/conversations", { params: { search: search.trim() } });
}

// -> { id, contact, unread, messages }
export function getConversation(id) {
  return http(`/conversations/${id}`);
}

// Empty text is rejected by the server with the code "EMPTY"
export function sendMessage({ id, text }) {
  return http(`/conversations/${id}/messages`, {
    method: "POST",
    body: { text },
  });
}

// The server creates a simulated reply; the "typing" delay stays here
export async function receiveReply(id) {
  await delay(1600 + Math.random() * 1400);
  return http(`/conversations/${id}/reply`, { method: "POST" });
}

export function markConversationRead(id) {
  return http(`/conversations/${id}/read`, { method: "PATCH" });
}
