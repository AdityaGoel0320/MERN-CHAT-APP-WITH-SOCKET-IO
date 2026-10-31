import React, { createContext, useContext, useEffect, useState } from "react";
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

const ThemeContext = createContext(null);

export const useAppTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem("chatbuddy-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch { return "light"; }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    try { localStorage.setItem("chatbuddy-theme", mode); } catch { return; }
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#6ee7b7" : "#087f5b" },
      background: { default: mode === "dark" ? "#121618" : "#f5f7f8", paper: mode === "dark" ? "#1b2124" : "#ffffff" },
      text: { primary: mode === "dark" ? "#edf2f4" : "#18252b", secondary: mode === "dark" ? "#9baeb7" : "#647780" },
    },
    typography: { fontFamily: '"DM Sans", sans-serif' },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme: () => setMode((current) => current === "light" ? "dark" : "light") }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}