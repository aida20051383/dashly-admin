import { http } from "@/lib/http.js";

// from / to به شکل YYYY-MM-DD و هر دو شامل
export function getEvents({ from, to }) {
  return http("/events", { params: { from, to } });
}

export function createEvent({ title, date, time, category }) {
  return http("/events", {
    method: "POST",
    body: { title, date, time: time || null, category },
  });
}

// → { id }
export function updateEvent({ id, title, date, time, category }) {
  return http(`/events/${id}`, {
    method: "PATCH",
    body: { title, date, time: time || null, category },
  });
}

export async function deleteEvent(id) {
  await http(`/events/${id}`, { method: "DELETE" });
  return { id };
}
