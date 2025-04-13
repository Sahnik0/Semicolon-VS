import React from "react";
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { useExtensions } from "@/contexts/ExtensionContext";

const ThemeToggle = () => {
  const { theme, setTheme, isUsingExtensionTheme } = useTheme();
  const { getActiveTheme } = useExtensions();

  const toggleTheme = () => {
    // If an extension theme is active, show a message that they need to change from extensions
    if (isUsingExtensionTheme) {
      const activeTheme = getActiveTheme();
      toast({
        title: `Extension Theme Active`,
        description: activeTheme 
          ? `The "${activeTheme.name}" extension theme is active. Change themes from the Extensions view.`
          : `An extension theme is active. Change themes from the Extensions view.`,
        duration: 3000,
      });
      return;
    }

    // Otherwise toggle between light and dark
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
