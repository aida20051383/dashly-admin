import { useTheme } from "@/app/ThemeProvider.jsx";

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="w-80 rounded-xl bg-card p-6 shadow-card">
        <h1 className="text-lg font-semibold text-heading">Theme test</h1>
        <p className="mt-1 text-sm">
          Cards, text and borders follow the theme.
        </p>

        <button
          onClick={toggleTheme}
          className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-opacity hover:opacity-90"
        >
          Switch to {isDark ? "light" : "dark"}
        </button>
      </div>
    </div>
  );
}
