export type Theme = "light" | "dark";

const themes = {
  light: {
    "--bg-color": "#f0f2f5",            // Fondo claro, muy suave
    "--secondary-bg": "#ffffff",         // Blanco puro para paneles
    "--text-color": "#222222",           // Negro suave, nada duro
    "--button-bg": "#4a90e2",            // Azul tech vibrante
    "--button-border": "transparent",
    "--button-hover-bg": "#357ABD",      // Azul hover más oscuro
    "--bg-msg-mine": "#d0ebff",          // Azul claro para mensajes propios
    "--bg-msg-other": "#e9eff5",         // Gris azulado para otros mensajes
    "--text-msg-mine": "#0b3d91",        // Azul oscuro texto propio
    "--text-msg-other": "#3a3a3a",       // Gris oscuro texto ajeno
    "--shadow-primary": "0 4px 12px rgba(0, 0, 0, 0.1)",  // sombra principal suave
    "--shadow-secondary": "0 2px 8px rgba(0, 0, 0, 0.06)",
    "--border-radius": "12px",
    "--transition": "all 0.3s ease",
  },
  dark: {
    "--bg-color": "#121212",             // Fondo muy oscuro
    "--secondary-bg": "#1e1e1e",         // Panel oscuro
    "--text-color": "#e1e1e1",           // Blanco suave
    "--button-bg": "#2979ff",            // Azul brillante para botón
    "--button-border": "transparent",
    "--button-hover-bg": "#1565c0",      // Azul hover más intenso
    "--bg-msg-mine": "#1a73e8",          // Azul vibrante para mensajes propios
    "--bg-msg-other": "#2c2c2c",         // Gris oscuro para otros mensajes
    "--text-msg-mine": "#d0e6ff",        // Azul claro texto propio
    "--text-msg-other": "#cfcfcf",       // Gris claro texto ajeno
    "--shadow-primary": "0 6px 16px rgba(0, 0, 0, 0.6)",   // sombra más marcada
    "--shadow-secondary": "0 4px 10px rgba(0, 0, 0, 0.4)",
    "--border-radius": "12px",
    "--transition": "all 0.3s ease",
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
