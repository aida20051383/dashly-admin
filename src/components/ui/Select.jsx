import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn.js";

export default function Select({ label, value, onChange, options, className }) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-border bg-card ps-3 pe-9 text-sm text-heading outline-none transition-colors focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
