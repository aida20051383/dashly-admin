import { useId } from "react";
import { cn } from "@/lib/cn.js";

export default function TextField({
  label,
  error,
  hint,
  multiline = false,
  className,
  ...props
}) {
  const id = useId();
  const messageId = `${id}-message`;
  const Control = multiline ? "textarea" : "input";

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-heading"
      >
        {label}
      </label>

      <Control
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(
          "w-full rounded-lg border bg-transparent px-3 text-heading outline-none transition-colors",
          "placeholder:text-muted focus:border-primary",
          multiline ? "min-h-28 resize-y py-2.5" : "h-11",
          error ? "border-danger" : "border-border",
        )}
        {...props}
      />

      {error ? (
        <p id={messageId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
