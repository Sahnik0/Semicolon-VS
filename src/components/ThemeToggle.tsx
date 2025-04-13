
import React from "react";
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast({
      title: `Theme Changed`,
      description: `Switched to ${newTheme} theme`,
      duration: 1500,
    });
    console.log("Theme toggled to:", newTheme);
  };

  return (
    <Toggle
      pressed={theme === "dark"}
      onPressedChange={() => toggleTheme()}
      aria-label="Toggle theme"
      className="h-8 w-8 rounded-md"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Toggle>
  );
};

export default ThemeToggle;
