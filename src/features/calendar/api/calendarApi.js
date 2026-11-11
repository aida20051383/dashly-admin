import { ApiError } from "@/lib/ApiError.js";
import { toKey } from "@/lib/calendar.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const now = new Date();
const day = (n) => toKey(new Date(now.getFullYear(), now.getMonth(), n));

let events = [
  {
    id: 1,
    title: "Team standup",
    date: day(3),
    time: "09:30",
    category: "meeting",
  },
  {
    id: 2,
    title: "Launch new collection",
    date: day(8),
    time: "",
    category: "work",
  },
  {
    id: 3,
    title: "Supplier call",
    date: day(8),
    time: "14:00",
    category: "meeting",
  },
  {
    id: 4,
    title: "Dentist appointment",
    date: day(12),
    time: "17:30",
    category: "personal",
  },
  {
    id: 5,
    title: "Quarterly report due",
    date: day(15),
    time: "",
    category: "deadline",
  },
  {
    id: 6,
    title: "Design review",
    date: day(15),
    time: "11:00",
    category: "meeting",
  },
  {
    id: 7,
    title: "Plan holiday sale",
    date: day(21),
    time: "",
    category: "work",
  },
  {
    id: 8,
    title: "Birthday dinner",
    date: day(24),
    time: "20:00",
    category: "personal",
  },
  {
    id: 9,
    title: "Tax filing deadline",
    date: day(28),
    time: "",
    category: "deadline",
  },
];

const byDateThenTime = (a, b) =>
  a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || a.id - b.id;

// from / to به شکل YYYY-MM-DD و هر دو شامل
export async function getEvents({ from, to }) {
  await delay(350);
  return events
    .filter((e) => e.date >= from && e.date <= to)
    .sort(byDateThenTime);
}

export async function createEvent({ title, date, time, category }) {
  await delay(400);
  const event = {
    id: Math.max(0, ...events.map((e) => e.id)) + 1,
    title: title.trim(),
    date,
    time: time || "",
    category,
  };
  events = [...events, event];
  return event;
}

export async function updateEvent({ id, title, date, time, category }) {
  await delay(400);
  if (!events.some((e) => e.id === id)) throw new ApiError("NOT_FOUND");
  events = events.map((e) =>
    e.id === id
      ? { ...e, title: title.trim(), date, time: time || "", category }
      : e,
  );
  return { id };
}

export async function deleteEvent(id) {
  await delay(350);
  if (!events.some((e) => e.id === id)) throw new ApiError("NOT_FOUND");
  events = events.filter((e) => e.id !== id);
  return { id };
}
