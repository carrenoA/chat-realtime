export type Theme = "light" | "dark";

const themes = {
  light: {
    "--bg-color": "#f0f2f5",            
    "--secondary-bg": "#ffffff",        
    "--text-color": "#222222",         
    "--button-bg": "#4a90e2",            
    "--button-border": "transparent",
    "--button-hover-bg": "#357ABD",     
    "--bg-msg-mine": "#d0ebff",          
    "--bg-msg-other": "#e9eff5",        
    "--text-msg-mine": "#0b3d91",       
    "--text-msg-other": "#3a3a3a",       
    "--shadow-primary": "0 4px 12px rgba(0, 0, 0, 0.1)",  
    "--shadow-secondary": "0 2px 8px rgba(0, 0, 0, 0.06)",
    "--border-radius": "12px",
    "--transition": "all 0.3s ease",
  },
  dark: {
    "--bg-color": "#121212",            
    "--secondary-bg": "#1e1e1e",       
    "--text-color": "#e1e1e1",          
    "--button-bg": "#2979ff",           
    "--button-border": "transparent",
    "--button-hover-bg": "#1565c0",      
    "--bg-msg-mine": "#1a73e8",         
    "--bg-msg-other": "#2c2c2c",        
    "--text-msg-mine": "#d0e6ff",        
    "--text-msg-other": "#cfcfcf",      
    "--shadow-primary": "0 6px 16px rgba(0, 0, 0, 0.6)",   
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
