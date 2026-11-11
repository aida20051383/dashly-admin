import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import { categoryStyles } from "@/features/calendar/components/CalendarGrid.jsx";
import {
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
} from "@/features/calendar/hooks/useEvents.js";
import { useToast } from "@/app/ToastProvider.jsx";
import { CATEGORIES, formatFullDate, fromKey } from "@/lib/calendar.js";
import { cn } from "@/lib/cn.js";

const controlClass =
  "h-11 w-full rounded-lg border border-border bg-transparent px-3 text-sm text-heading outline-none transition-colors focus:border-primary";

export default function DayPanel({ dayKey, events }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const create = useCreateEvent();
  const update = useUpdateEvent();
  const remove = useDeleteEvent();

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("meeting");
  const [invalid, setInvalid] = useState(false);

  const saving = create.isPending || update.isPending;
  const heading = formatFullDate(fromKey(dayKey), i18n.language);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setTime("");
    setCategory("meeting");
    setInvalid(false);
  };

  const startEdit = (event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setTime(event.time);
    setCategory(event.category);
    setInvalid(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setInvalid(true);
      return;
    }

    const values = { title, date: dayKey, time, category };
    const onError = () => toast.error(t("calendar.toast.failed"));

    if (editingId) {
      update.mutate(
        { id: editingId, ...values },
        {
          onSuccess: () => {
            resetForm();
            toast.success(t("calendar.toast.updated"));
          },
          onError,
        },
      );
    } else {
      create.mutate(values, {
        onSuccess: () => {
          resetForm();
          toast.success(t("calendar.toast.created"));
        },
        onError,
      });
    }
  };

  const onDelete = (event) =>
    remove.mutate(event.id, {
      onSuccess: () => {
        if (editingId === event.id) resetForm();
        toast.success(t("calendar.toast.deleted"));
      },
      onError: () => toast.error(t("calendar.toast.failed")),
    });

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-heading">{heading}</h2>

      {events.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          {t("calendar.panel.noEvents")}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <span
                className={cn(
                  "h-9 w-1 shrink-0 rounded-full",
                  categoryStyles[event.category].dot,
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-heading">
                  {event.title}
                </p>
                <p className="text-xs text-muted">
                  <bdi dir="ltr">
                    {event.time || t("calendar.panel.allDay")}
                  </bdi>
                  {" · "}
                  {t(`calendar.categories.${event.category}`)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startEdit(event)}
                aria-label={`${t("calendar.panel.edit")}: ${event.title}`}
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-heading"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(event)}
                disabled={remove.isPending}
                aria-label={`${t("calendar.panel.delete")}: ${event.title}`}
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-danger"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={submit}
        noValidate
        className="mt-6 space-y-4 border-t border-border pt-5"
      >
        <h3 className="text-sm font-semibold text-heading">
          {editingId
            ? t("calendar.panel.editTitle")
            : t("calendar.panel.addTitle")}
        </h3>

        <div>
          <label
            htmlFor="event-title"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            {t("calendar.panel.titleLabel")}
          </label>
          <input
            id="event-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setInvalid(false);
            }}
            aria-invalid={invalid}
            className={cn(controlClass, invalid && "border-danger")}
          />
          {invalid && (
            <p role="alert" className="mt-1.5 text-xs text-danger">
              {t("calendar.panel.required")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="event-time"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              {t("calendar.panel.timeLabel")}
            </label>
            <input
              id="event-time"
              type="time"
              dir="ltr"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={controlClass}
            />
          </div>
          <div>
            <label
              htmlFor="event-category"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              {t("calendar.panel.categoryLabel")}
            </label>
            <select
              id="event-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cn(controlClass, "bg-card")}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`calendar.categories.${c}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-hover"
            >
              {t("calendar.panel.cancel")}
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {editingId
              ? saving
                ? t("calendar.panel.saving")
                : t("calendar.panel.save")
              : saving
                ? t("calendar.panel.adding")
                : t("calendar.panel.add")}
          </button>
        </div>
      </form>
    </Card>
  );
}
