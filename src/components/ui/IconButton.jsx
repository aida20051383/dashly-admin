import { cn } from "@/lib/cn.js";

const badgeTone = {
  primary: "bg-primary",
  danger: "bg-danger",
};

export default function IconButton({
  label,
  badge,
  badgeTone: tone = "primary",
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-full text-foreground transition-colors",
        "hover:bg-hover hover:text-primary focus-visible:outline-2 focus-visible:outline-primary",
        className,
      )}
      {...props}
    >
      {children}
      {badge ? (
        <span
          className={cn(
            "absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1",
            "text-[11px] font-semibold leading-none text-white ring-2 ring-card",
            badgeTone[tone],
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
