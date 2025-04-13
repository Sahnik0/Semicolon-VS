import React, { createContext, useContext, useEffect, useState } from "react";

// Utility to convert hex to HSL
const hexToHSL = (hex: string): string => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `${h} ${s}% ${l}%`;
};

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  isUsingExtensionTheme: boolean;
  setIsUsingExtensionTheme: (isUsing: boolean) => void;
  applyExtensionTheme: (themeColors: Record<string, string>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "vscode-theme-preference";
const EXTENSION_THEME_KEY = "vscode-extension-theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return savedTheme || "dark";
    }
    return "dark";
  });

  const [isUsingExtensionTheme, setIsUsingExtensionTheme] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(EXTENSION_THEME_KEY);
    }
    return false;
  });

  const [previousTheme, setPreviousTheme] = useState<string>("dark");
  const [extensionThemeColors, setExtensionThemeColors] = useState<Record<string, string> | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(EXTENSION_THEME_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const setTheme = (newTheme: string) => {
    if (isUsingExtensionTheme) {
      resetTheme();
    }

    setThemeState(newTheme);
    setPreviousTheme(newTheme);

    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      localStorage.removeItem(EXTENSION_THEME_KEY);
      setExtensionThemeColors(null);

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      root.setAttribute("data-using-extension-theme", "false");
    }
  };

  const applyExtensionTheme = (themeColors: Record<string, string>) => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    setPreviousTheme(theme);
    setIsUsingExtensionTheme(true);
    setExtensionThemeColors(themeColors);

    // Clear all previous custom properties
    const customProps = Array.from(root.style).filter((prop) => prop.startsWith("--"));
    customProps.forEach((prop) => root.style.removeProperty(prop));

    // Clear light/dark classes
    root.classList.remove("light", "dark");

    // Determine if theme is dark or light based on background color
    const bgColor = themeColors["--background"] || "#ffffff";
    const isDarkTheme = isColorDark(bgColor);

    // Add the appropriate class based on theme brightness
    if (isDarkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }

    root.setAttribute("data-using-extension-theme", "true");

    // Map extension theme colors to all necessary variables
    const mappedColors: Record<string, string> = {
      "--custom-background": themeColors["--background"] || (isDarkTheme ? "#121212" : "#ffffff"),
      "--custom-foreground": themeColors["--foreground"] || (isDarkTheme ? "#e0e0e0" : "#333333"),
      "--custom-primary": themeColors["--primary-color"] || "#007acc",
      "--custom-vscode-dark-sidebar": themeColors["--vscode-sidebar-background"] || (isDarkTheme ? "#252526" : "#f5f5f5"),
      "--custom-vscode-terminal": themeColors["--vscode-terminal-background"] || (isDarkTheme ? "#1e1e1e" : "#f8f8f8"),
      "--custom-vscode-statusbar": themeColors["--vscode-statusBar-background"] || (isDarkTheme ? "#007acc" : "#007acc"),
      "--custom-vscode-activitybar-dark": themeColors["--vscode-sidebar-background"] || (isDarkTheme ? "#333333" : "#f5f5f5"),
      "--custom-editor-background": themeColors["--vscode-editor-background"] || (isDarkTheme ? "#1e1e1e" : "#ffffff"),
      "--custom-editor-foreground": themeColors["--vscode-editor-foreground"] || (isDarkTheme ? "#d4d4d4" : "#333333"),
    };

    // Convert hex to HSL for Tailwind compatibility
    Object.keys(mappedColors).forEach((key) => {
      if (mappedColors[key]?.startsWith("#")) {
        mappedColors[key] = hexToHSL(mappedColors[key]);
      }
    });

    // Ensure all Tailwind variables are mapped with better contrast awareness
    mappedColors["--custom-card"] = mappedColors["--custom-background"];
    mappedColors["--custom-card-foreground"] = mappedColors["--custom-foreground"];
    mappedColors["--custom-popover"] = mappedColors["--custom-background"];
    mappedColors["--custom-popover-foreground"] = mappedColors["--custom-foreground"];
    mappedColors["--custom-primary-foreground"] = isDarkTheme ? hexToHSL("#ffffff") : hexToHSL("#ffffff");
    mappedColors["--custom-secondary"] = isDarkTheme ? hexToHSL("#2d2d2d") : hexToHSL("#f3f3f3");
    mappedColors["--custom-secondary-foreground"] = isDarkTheme ? hexToHSL("#e0e0e0") : hexToHSL("#333333");
    mappedColors["--custom-muted"] = isDarkTheme ? hexToHSL("#383838") : hexToHSL("#f3f3f3");
    mappedColors["--custom-muted-foreground"] = isDarkTheme ? hexToHSL("#a0a0a0") : hexToHSL("#6b7280");
    mappedColors["--custom-accent"] = isDarkTheme ? hexToHSL("#2d2d2d") : hexToHSL("#f3f3f3");
    mappedColors["--custom-accent-foreground"] = isDarkTheme ? hexToHSL("#e0e0e0") : hexToHSL("#333333");
    mappedColors["--custom-destructive"] = hexToHSL(isDarkTheme ? "#a53030" : "#ef4444");
    mappedColors["--custom-destructive-foreground"] = hexToHSL("#ffffff");
    mappedColors["--custom-border"] = isDarkTheme ? hexToHSL("#3a3a3a") : hexToHSL("#d1d5db");
    mappedColors["--custom-input"] = isDarkTheme ? hexToHSL("#3a3a3a") : hexToHSL("#d1d5db");
    mappedColors["--custom-ring"] = mappedColors["--custom-primary"];

    // Apply all mapped colors
    Object.entries(mappedColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(EXTENSION_THEME_KEY, JSON.stringify(themeColors));
      localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme ? "dark" : "light");
    }
  };

  // Helper function to determine if a color is dark
  const isColorDark = (hexColor: string): boolean => {
    // Remove # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    let r = 0, g = 0, b = 0;
    if (hexColor.length === 3) {
      r = parseInt(hexColor[0] + hexColor[0], 16);
      g = parseInt(hexColor[1] + hexColor[1], 16);
      b = parseInt(hexColor[2] + hexColor[2], 16);
    } else if (hexColor.length >= 6) {
      r = parseInt(hexColor.substring(0, 2), 16);
      g = parseInt(hexColor.substring(2, 4), 16);
      b = parseInt(hexColor.substring(4, 6), 16);
    }
    
    // Calculate relative luminance (perception-based brightness)
    // Using the formula from WCAG 2.0
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // If luminance is less than 0.5, consider it dark
    return luminance < 0.5;
  };

  const resetTheme = () => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    // Clear all custom properties
    const customProps = Array.from(root.style).filter((prop) => prop.startsWith("--"));
    customProps.forEach((prop) => root.style.removeProperty(prop));

    setIsUsingExtensionTheme(false);
    setExtensionThemeColors(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem(EXTENSION_THEME_KEY);
      localStorage.setItem(THEME_STORAGE_KEY, previousTheme);
    }

    setThemeState(previousTheme);
    root.classList.remove("light", "dark");
    root.classList.add(previousTheme);
    root.setAttribute("data-using-extension-theme", "false");
  };

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    if (isUsingExtensionTheme && extensionThemeColors) {
      applyExtensionTheme(extensionThemeColors);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.setAttribute("data-using-extension-theme", "false");
    }
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    if (isUsingExtensionTheme && extensionThemeColors) {
      applyExtensionTheme(extensionThemeColors);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.setAttribute("data-using-extension-theme", "false");
    }

    return () => {
      root.classList.remove("light", "dark");
      root.removeAttribute("data-using-extension-theme");
      const customProps = Array.from(root.style).filter((prop) => prop.startsWith("--"));
      customProps.forEach((prop) => root.style.removeProperty(prop));
    };
  }, [theme, isUsingExtensionTheme, extensionThemeColors]);

  // Listen for extension theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleExtensionThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;

      if (detail) {
        if (detail.isUsingExtensionTheme && detail.themeColors) {
          applyExtensionTheme(detail.themeColors);
        } else {
          resetTheme();
        }
      }
    };

    window.addEventListener("extension-theme-changed", handleExtensionThemeChange);

    return () => {
      window.removeEventListener("extension-theme-changed", handleExtensionThemeChange);
    };
  }, [theme, previousTheme]);

  const contextValue = {
    theme,
    setTheme,
    isUsingExtensionTheme,
    setIsUsingExtensionTheme,
    applyExtensionTheme,
    resetTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};