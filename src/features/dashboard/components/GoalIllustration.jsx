export default function GoalIllustration({ className }) {
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
      <circle cx="120" cy="78" r="64" fill="#7367F0" opacity="0.12" />

      {/* لپ‌تاپ */}
      <rect
        x="62"
        y="34"
        width="116"
        height="72"
        rx="8"
        fill="#7367F0"
        opacity="0.18"
        stroke="#7367F0"
        strokeWidth="3"
      />
      <rect x="82" y="74" width="14" height="20" rx="3" fill="#7367F0" />
      <rect x="106" y="60" width="14" height="34" rx="3" fill="#28C76F" />
      <rect x="130" y="48" width="14" height="46" rx="3" fill="#FF9F43" />
      <rect x="154" y="64" width="14" height="30" rx="3" fill="#00CFE8" />
      <rect x="44" y="106" width="152" height="10" rx="5" fill="#7367F0" />

      {/* سکه */}
      <circle cx="196" cy="42" r="16" fill="#FFC24B" />
      <circle
        cx="196"
        cy="42"
        r="10"
        fill="none"
        stroke="#FFF6DD"
        strokeWidth="3"
      />

      {/* جرقه */}
      <path d="M40 50l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#00CFE8" />
    </svg>
  );
}
