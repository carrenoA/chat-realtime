export type Theme = "light" | "dark";

const themes = {
  light: {
    "--bg-color": "#e5ddd5",
    "--secondary-bg": "#f9f9f9",
    "--text-color": "#303030",
    "--button-bg": "#f0f0f0",
    "--button-border": "transparent",
    "--bg-msg-mine": "#d1e7dd", // Verde claro para tus mensajes
    "--bg-msg-other": "#f8f9fa", // Gris claro para mensajes ajenos
    "--text-msg-mine": "#0f5132", // Verde oscuro texto propio
    "--text-msg-other": "#212529", // Negro oscuro texto ajeno
  },
  dark: {
    "--bg-color": "#2a2f32",
    "--secondary-bg": "#1f2428",
    "--text-color": "#e1e1e1",
    "--button-bg": "#333",
    "--button-border": "#555",
    "--bg-msg-mine": "#198754", // Verde oscuro para tus mensajes
    "--bg-msg-other": "#343a40", // Gris oscuro para mensajes ajenos
    "--text-msg-mine": "#d1e7dd", // Verde claro texto propio
    "--text-msg-other": "#f8f9fa", // Gris claro texto ajeno
  },
};

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const themeVars = themes[theme];
  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.setAttribute("data-theme", theme);
}
