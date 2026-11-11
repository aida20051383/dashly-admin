import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import { PRIORITIES } from "@/features/todo/api/todoApi.js";
import { useCreateTodo } from "@/features/todo/hooks/useTodos.js";
import { useToast } from "@/app/ToastProvider.jsx";
import { cn } from "@/lib/cn.js";

const controlClass =
  "h-11 rounded-lg border border-border bg-transparent px-3 text-sm text-heading outline-none transition-colors focus:border-primary";

export default function TodoForm() {
  const { t } = useTranslation();
  const toast = useToast();
  const create = useCreateTodo();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [invalid, setInvalid] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setInvalid(true);
      return;
    }

    create.mutate(
      { title, priority, dueDate },
      {
        onSuccess: () => {
          setTitle("");
          setDueDate("");
          setInvalid(false);
          toast.success(t("todo.toast.created"));
        },
        onError: () => toast.error(t("todo.toast.failed")),
      },
    );
  };

  return (
    <Card className="p-4 sm:p-5">
      <form onSubmit={submit} noValidate className="flex flex-wrap gap-3">
        <div className="min-w-56 flex-1">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setInvalid(false);
            }}
            placeholder={t("todo.add.placeholder")}
            aria-label={t("todo.add.placeholder")}
            aria-invalid={invalid}
            className={cn(
              controlClass,
              "w-full placeholder:text-muted",
              invalid && "border-danger",
            )}
          />
          {invalid && (
            <p role="alert" className="mt-1.5 text-xs text-danger">
              {t("todo.add.required")}
            </p>
          )}
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label={t("todo.priority.label")}
          className={cn(controlClass, "bg-card")}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {t(`todo.priority.${p}`)}
            </option>
          ))}
        </select>

        <input
          type="date"
          dir="ltr"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label={t("todo.add.due")}
          className={controlClass}
        />

        <button
          type="submit"
          disabled={create.isPending}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus size={18} />
          {create.isPending ? t("todo.add.adding") : t("todo.add.button")}
        </button>
      </form>
    </Card>
  );
}
