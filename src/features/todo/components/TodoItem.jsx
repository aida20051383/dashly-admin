import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Pencil, Trash2, X } from "lucide-react";
import {
  useDeleteTodo,
  useToggleTodo,
  useUpdateTodo,
} from "@/features/todo/hooks/useTodos.js";
import { useToast } from "@/app/ToastProvider.jsx";
import { formatDate } from "@/lib/format.js";
import { cn } from "@/lib/cn.js";

const priorityStyles = {
  high: "bg-danger/15 text-danger",
  medium: "bg-warning/15 text-warning",
  low: "bg-info/15 text-info",
};

const toTimestamp = (day) => new Date(`${day}T00:00:00`).getTime();
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export default function TodoItem({ todo }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const toggle = useToggleTodo();
  const update = useUpdateTodo();
  const remove = useDeleteTodo();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const overdue =
    !todo.done && todo.dueDate && toTimestamp(todo.dueDate) < startOfToday();

  const startEdit = () => {
    setDraft(todo.title);
    setEditing(true);
  };

  const save = () => {
    if (!draft.trim() || draft.trim() === todo.title) {
      setEditing(false);
      return;
    }
    update.mutate(
      { id: todo.id, title: draft },
      {
        onSuccess: () => setEditing(false),
        onError: () => toast.error(t("todo.toast.failed")),
      },
    );
  };

  const onDelete = () =>
    remove.mutate(todo.id, {
      onSuccess: () => toast.success(t("todo.toast.deleted")),
      onError: () => toast.error(t("todo.toast.failed")),
    });

  const iconButton =
    "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-heading";

  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggle.mutate(todo.id)}
        aria-label={todo.title}
        className="size-5 shrink-0 cursor-pointer accent-primary"
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
            aria-label={t("todo.actions.edit")}
            className="h-9 w-full rounded-md border border-primary bg-transparent px-2 text-sm text-heading outline-none"
          />
        ) : (
          <p
            className={cn(
              "truncate text-sm font-medium",
              todo.done ? "text-muted line-through" : "text-heading",
            )}
          >
            {todo.title}
          </p>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              priorityStyles[todo.priority],
            )}
          >
            {t(`todo.priority.${todo.priority}`)}
          </span>
          {todo.dueDate && (
            <span
              className={overdue ? "font-medium text-danger" : "text-muted"}
            >
              {formatDate(toTimestamp(todo.dueDate), i18n.language)}
              {overdue && ` · ${t("todo.overdue")}`}
            </span>
          )}
        </div>
      </div>

      {editing ? (
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={save}
            aria-label={t("todo.actions.save")}
            className={cn(iconButton, "hover:text-success")}
          >
            <Check size={18} />
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-label={t("todo.actions.cancel")}
            className={iconButton}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={startEdit}
            aria-label={t("todo.actions.edit")}
            className={iconButton}
          >
            <Pencil size={17} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={remove.isPending}
            aria-label={t("todo.actions.delete")}
            className={cn(iconButton, "hover:text-danger")}
          >
            <Trash2 size={17} />
          </button>
        </div>
      )}
    </li>
  );
}
