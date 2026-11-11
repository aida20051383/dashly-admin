import { ApiError } from "@/lib/ApiError.js";
import { normalizeText } from "@/lib/text.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const PRIORITIES = ["low", "medium", "high"];

const DAY = 24 * 60 * 60 * 1000;
const dateFromToday = (days) =>
  new Date(Date.now() + days * DAY).toISOString().slice(0, 10);

let todos = [
  {
    id: 1,
    title: "Review this week's orders",
    priority: "high",
    dueDate: dateFromToday(-1),
    done: false,
    createdAt: Date.now() - 5 * DAY,
  },
  {
    id: 2,
    title: "Reply to customer emails",
    priority: "medium",
    dueDate: dateFromToday(0),
    done: false,
    createdAt: Date.now() - 4 * DAY,
  },
  {
    id: 3,
    title: "Update product photos",
    priority: "low",
    dueDate: dateFromToday(3),
    done: false,
    createdAt: Date.now() - 3 * DAY,
  },
  {
    id: 4,
    title: "Prepare monthly sales report",
    priority: "high",
    dueDate: dateFromToday(5),
    done: false,
    createdAt: Date.now() - 2 * DAY,
  },
  {
    id: 5,
    title: "Restock best-selling items",
    priority: "medium",
    dueDate: "",
    done: true,
    createdAt: Date.now() - 6 * DAY,
  },
  {
    id: 6,
    title: "Back up customer data",
    priority: "low",
    dueDate: "",
    done: true,
    createdAt: Date.now() - 7 * DAY,
  },
];

export async function getTodos({
  status = "all",
  priority = "all",
  search = "",
} = {}) {
  await delay(400);

  const q = normalizeText(search);
  const base = todos.filter(
    (t) =>
      (priority === "all" || t.priority === priority) &&
      (!q || normalizeText(t.title).includes(q)),
  );

  const counts = {
    all: base.length,
    active: base.filter((t) => !t.done).length,
    done: base.filter((t) => t.done).length,
  };

  const items = base
    .filter((t) => status === "all" || (status === "done" ? t.done : !t.done))
    .sort(
      (a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt,
    );

  return { items, counts };
}

export async function createTodo({ title, priority, dueDate }) {
  await delay(400);
  const todo = {
    id: Math.max(0, ...todos.map((t) => t.id)) + 1,
    title: title.trim(),
    priority,
    dueDate: dueDate || "",
    done: false,
    createdAt: Date.now(),
  };
  todos = [todo, ...todos];
  return todo;
}

export async function toggleTodo(id) {
  await delay(350);
  const todo = todos.find((t) => t.id === id);
  if (!todo) throw new ApiError("NOT_FOUND");
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  return { id };
}

export async function updateTodo({ id, title }) {
  await delay(350);
  if (!todos.some((t) => t.id === id)) throw new ApiError("NOT_FOUND");
  todos = todos.map((t) => (t.id === id ? { ...t, title: title.trim() } : t));
  return { id };
}

export async function deleteTodo(id) {
  await delay(350);
  if (!todos.some((t) => t.id === id)) throw new ApiError("NOT_FOUND");
  todos = todos.filter((t) => t.id !== id);
  return { id };
}
