import { cn } from "@/lib/cn.js";

export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7367F0" />
          <stop offset="1" stopColor="#A59DF7" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />
      <rect
        x="11"
        y="26"
        width="6"
        height="11"
        rx="3"
        fill="#fff"
        opacity="0.7"
      />
      <rect
        x="21"
        y="18"
        width="6"
        height="19"
        rx="3"
        fill="#fff"
        opacity="0.85"
      />
      <rect x="31" y="10" width="6" height="27" rx="3" fill="#fff" />
    </svg>
  );
}

export default function Logo({ showText = true, className }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark className="size-9 shrink-0 rounded-xl shadow-glow" />
      {showText && (
        <span className="text-xl font-bold tracking-tight text-heading">
          Dashly
        </span>
      )}
    </span>
  );
}
