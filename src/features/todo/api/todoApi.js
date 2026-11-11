import { http } from "@/lib/http.js";

export const PRIORITIES = ["low", "medium", "high"];

// → { items, counts: { all, active, done } }
export function getTodos({ status = "all", priority = "all", search = "" } = {}) {
  return http("/todos", {
    params: { status, priority, search: search.trim() },
  });
}

export function createTodo({ title, priority, dueDate }) {
  return http("/todos", {
    method: "POST",
    body: { title, priority, dueDate: dueDate || null },
  });
}

// → { id }
export function toggleTodo(id) {
  return http(`/todos/${id}/toggle`, { method: "PATCH" });
}

// → { id }
export function updateTodo({ id, title }) {
  return http(`/todos/${id}`, { method: "PATCH", body: { title } });
}

export async function deleteTodo(id) {
  await http(`/todos/${id}`, { method: "DELETE" });
  return { id };
}
