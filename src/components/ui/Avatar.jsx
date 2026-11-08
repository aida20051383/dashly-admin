import { cn } from "@/lib/cn.js";

export default function Avatar({ initials, online = false, className }) {
  return (
    <span
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-full",
        "bg-linear-to-br from-primary to-primary/60 text-sm font-semibold text-white",
        className,
      )}
    >
      {initials}
      {online && (
        <span className="absolute bottom-0 end-0 size-2.5 rounded-full bg-success ring-2 ring-card" />
      )}
    </span>
  );
}
