import React from "react";

const themes = [
  { id: "light", label: "Light", preview: "#2563eb" },
  { id: "dark", label: "Dark", preview: "#38bdf8" },
  { id: "midnight", label: "Midnight", preview: "#60a5fa" },
  { id: "aurora", label: "Aurora", preview: "#a78bfa" },
  { id: "frost", label: "Frost", preview: "#0ea5e9" },
  { id: "pink", label: "Pink", preview: "#ec4899" },
  /* ✨ New Modern Themes */
  { id: "sunset", label: "Sunset", preview: "#f97316" },
  { id: "forest", label: "Forest", preview: "#22c55e" },
  { id: "amber", label: "Amber", preview: "#f59e0b" },
  { id: "neon", label: "Neon", preview: "#14b8a6" },
  { id: "carbon", label: "Carbon", preview: "#6b7280" },

];

export default function Colors() {
    React.useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
}, []);
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div className="p-6">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Appearance
      </h2>

      <div className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-8
        gap-4
      ">
        {themes.map((t) => (
          <div
            key={t.id}
            onClick={() => applyTheme(t.id)}
            className="cursor-pointer p-4 rounded-xl transition-all"
            style={{
              background: "var(--box-color)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <div
              className="h-14 rounded-lg mb-2"
              style={{
                background: `linear-gradient(135deg, ${t.preview}, rgba(255,255,255,0.15))`,
              }}
            />
            <div className="text-sm font-medium">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

