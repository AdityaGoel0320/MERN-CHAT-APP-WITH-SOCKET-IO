import React from "react";
import { Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { useAppTheme } from "../styles/ThemeProvider";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useAppTheme();
  const label = `Switch to ${mode === "light" ? "dark" : "light"} theme`;
  return (
    <Tooltip title={label}>
      <button className="icon-button" onClick={toggleTheme} aria-label={label}>
        {mode === "light" ? <Moon size={19} /> : <Sun size={19} />}
      </button>
    </Tooltip>
  );
}
