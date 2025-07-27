"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { themes, type Theme, applyTheme } from "@/config/themes";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  setTheme: (themeId: string) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "stone",
  defaultMode = "system",
  storageKey = "app-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const { themeId } = JSON.parse(stored);
          return themes.find((t) => t.id === themeId) || themes[0];
        } catch {
          // Invalid stored data
        }
      }
    }
    return themes.find((t) => t.id === defaultTheme) || themes[0];
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const { mode } = JSON.parse(stored);
          return mode || defaultMode;
        } catch {
          // Invalid stored data
        }
      }
    }
    return defaultMode;
  });

  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">(() => {
    if (mode === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light";
    }
    return mode === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Apply theme
    applyTheme(theme, resolvedMode);

    // Apply dark mode class
    root.classList.remove("light", "dark");
    root.classList.add(resolvedMode);

    // Store preferences
    localStorage.setItem(
      storageKey,
      JSON.stringify({ themeId: theme.id, mode }),
    );
  }, [theme, mode, resolvedMode, storageKey]);

  useEffect(() => {
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        setResolvedMode(mediaQuery.matches ? "dark" : "light");
      };

      handleChange();
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedMode(mode === "dark" ? "dark" : "light");
    }
  }, [mode]);

  const setTheme = (themeId: string) => {
    const newTheme = themes.find((t) => t.id === themeId);
    if (newTheme) {
      setThemeState(newTheme);
    }
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, mode, resolvedMode, setTheme, setMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
