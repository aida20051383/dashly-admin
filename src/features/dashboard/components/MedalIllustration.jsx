export default function MedalIllustration({ className }) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="medal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD36B" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      <polygon points="18,0 50,0 74,64 44,64" fill="#7367F0" />
      <polygon points="102,0 70,0 46,64 76,64" fill="#5E50EE" />

      <circle cx="60" cy="102" r="38" fill="url(#medal-gold)" />
      <circle
        cx="60"
        cy="102"
        r="29"
        fill="#FFC24B"
        stroke="#FFE3A3"
        strokeWidth="2"
      />

      <polygon
        points="60,88 63.5,97.2 73.3,97.7 65.7,103.9 68.2,113.3 60,108 51.8,113.3 54.3,103.9 46.7,97.7 56.5,97.2"
        fill="#FFF6DD"
      />
    </svg>
  );
}
