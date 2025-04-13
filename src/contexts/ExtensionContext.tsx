import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

// Add global interface for window extensions
declare global {
  interface Window {
    hackathonTimerInterval?: number;
    codeReviewObserver?: MutationObserver;
    extensionData: Record<string, any>;
    extensionCleanup: Record<string, Function>;
    vscodeExtensionApi?: {
      commands?: Record<string, Function>;
      events?: Record<string, Function[]>;
      registerCommand: (id: string, callback: Function) => void;
      executeCommand: (id: string, ...args: any[]) => any;
      getRegisteredCommands: () => string[];
      getInstalledExtensions: () => Extension[];
      registerExtensionEvent: (eventName: string, callback: Function) => void;
    };
  }
}

// Initialize global extension data and cleanup functions
if (typeof window !== "undefined") {
  window.extensionData = window.extensionData || {};
  window.extensionCleanup = window.extensionCleanup || {};
  
  // Initialize VS Code extension API interface
  window.vscodeExtensionApi = window.vscodeExtensionApi || {
    commands: {},
    events: {},
    registerCommand: (id, callback) => {
      if (!window.vscodeExtensionApi) return;
      window.vscodeExtensionApi.commands = window.vscodeExtensionApi.commands || {};
      window.vscodeExtensionApi.commands[id] = callback;
    },
    executeCommand: (id, ...args) => {
      if (!window.vscodeExtensionApi?.commands?.[id]) {
        console.warn(`Command ${id} not registered`);
        return null;
      }
      try {
        return window.vscodeExtensionApi.commands[id](...args);
      } catch (error) {
        console.error(`Error executing command ${id}:`, error);
        return null;
      }
    },
    getRegisteredCommands: () => {
      if (!window.vscodeExtensionApi?.commands) return [];
      return Object.keys(window.vscodeExtensionApi.commands);
    },
    getInstalledExtensions: () => {
      try {
        const saved = localStorage.getItem("installed_extensions");
        if (!saved) return [];
        return JSON.parse(saved) as Extension[];
      } catch (e) {
        console.error("Failed to get installed extensions:", e);
        return [];
      }
    },
    registerExtensionEvent: (eventName, callback) => {
      if (!window.vscodeExtensionApi) return;
      window.vscodeExtensionApi.events = window.vscodeExtensionApi.events || {};
      window.vscodeExtensionApi.events[eventName] = window.vscodeExtensionApi.events[eventName] || [];
      window.vscodeExtensionApi.events[eventName].push(callback);
    }
  };
}

export interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  icon: string;
  version: string;
  downloads: number;
  rating: number;
  categories: string[];
  tags: string[];
  price: string;
  installed: boolean;
  enabled: boolean;
  styles?: Record<string, string>;
  features?: string[];
  themeColors?: Record<string, string>;
  preview: string;
  configurable?: boolean;
  extensionType: "theme" | "feature" | "tool";
  commands?: { id: string; title: string; keybinding?: string }[];
  configuration?: { properties: Record<string, any> };
  onInstall?: () => void;
  onUninstall?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
  registerCommands?: () => void;
}

interface ExtensionContextType {
  installedExtensions: Extension[];
  installExtension: (extension: Extension) => void;
  uninstallExtension: (extensionId: string) => void;
  enableExtension: (extensionId: string) => void;
  disableExtension: (extensionId: string) => void;
  toggleExtension: (extensionId: string) => void;
  isExtensionInstalled: (extensionId: string) => boolean;
  isExtensionEnabled: (extensionId: string) => boolean;
  getActiveTheme: () => Extension | null;
  getActiveThemeColors: () => Record<string, string>;
  getExtensionCommands: () => { id: string; title: string; keybinding?: string; extensionId: string }[];
  executeCommand: (commandId: string, ...args: any[]) => any;
  getExtensionById: (extensionId: string) => Extension | undefined;
  configureExtension: (extensionId: string, config: any) => void;
}

const ExtensionContext = createContext<ExtensionContextType | null>(null);

// Store original extension definitions to restore functions when loading from localStorage
const extensionRegistry: Record<string, Extension> = {};

// Function to safely execute extension functions with error handling
const safeExecuteExtensionFunction = (extension: Extension, funcName: keyof Extension, ...args: any[]) => {
  if (!extension[funcName] || typeof extension[funcName] !== 'function') return false;
  
  try {
    (extension[funcName] as Function)(...args);
    return true;
  } catch (error) {
    console.error(`Error in ${extension.name} ${String(funcName)}:`, error);
    toast({
      title: "Extension Error",
      description: `${extension.name} encountered an error. Try disabling and re-enabling it.`,
      variant: "destructive",
    });
    return false;
  }
};

// Function to register original extension definitions
export const registerExtension = (extension: Extension) => {
  // Store original extension for future reference
  extensionRegistry[extension.id] = {...extension};

  // Add proper error handling to extension functions
  type ExtensionFuncKey = keyof Pick<Extension, 'onInstall' | 'onUninstall' | 'onEnable' | 'onDisable' | 'registerCommands'>;
  (['onInstall', 'onUninstall', 'onEnable', 'onDisable', 'registerCommands'] as ExtensionFuncKey[]).forEach(funcName => {
    if (extension[funcName]) {
      const originalFunc = extension[funcName] as Function;
      extension[funcName] = ((...args: any[]) => {
        try {
          return originalFunc(...args);
        } catch (error) {
          console.error(`Error in ${extension.name} ${funcName}:`, error);
          toast({
            title: "Extension Error",
            description: `${extension.name} encountered an error. Try disabling and re-enabling it.`,
            variant: "destructive",
          });
        }
      }) as any;
    }
  });

  return extension;
};

export const useExtensions = () => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error("useExtensions must be used within an ExtensionProvider");
  }
  return context;
};

export const ExtensionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [installedExtensions, setInstalledExtensions] = useState<Extension[]>([]);
  
  // Load installed extensions from localStorage on initial load
  useEffect(() => {
    const savedExtensions = localStorage.getItem("installed_extensions");
    if (savedExtensions) {
      try {
        const parsed = JSON.parse(savedExtensions);
        
        // Restore function properties from the registry for each extension
        const restoredExtensions = parsed.map((savedExt: Extension) => {
          const originalExt = extensionRegistry[savedExt.id];
          if (originalExt) {
            // Merge saved state (enabled, installed) with original functions
            return {
              ...originalExt,
              installed: savedExt.installed,
              enabled: savedExt.enabled
            };
          }
          return savedExt;
        });
        
        setInstalledExtensions(restoredExtensions);
        
        // Enable all extensions that were previously enabled
        restoredExtensions.forEach((ext: Extension) => {
          if (ext.enabled) {
            if (ext.extensionType === "theme") {
              applyTheme(ext);
            } else if (ext.onEnable) {
              ext.onEnable();
            }
          }
        });
      } catch (error) {
        console.error("Failed to parse installed extensions:", error);
      }
    }
    
    // Clean up on unmount - disable all enabled extensions
    return () => {
      const enabledExtensions = installedExtensions.filter(ext => ext.enabled);
      enabledExtensions.forEach(ext => {
        if (ext.onDisable) {
          safeExecuteExtensionFunction(ext, 'onDisable');
        }
      });
    };
  }, []);
  
  // Save installed extensions to localStorage whenever they change
  useEffect(() => {
    if (installedExtensions.length > 0) {
      localStorage.setItem("installed_extensions", JSON.stringify(installedExtensions));
    } else {
      localStorage.removeItem("installed_extensions");
      // Reset to default theme when no extensions are installed
      resetToDefaultTheme();
    }
  }, [installedExtensions]);
  
  // Helper function to apply a theme - implement directly without useTheme dependency
  const applyTheme = useCallback((theme: Extension) => {
    if (!theme.themeColors) return;
    
    const root = document.documentElement;
    
    // Apply theme colors directly
    Object.entries(theme.themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Mark document as using theme extension
    root.setAttribute("data-using-extension-theme", "true");
    root.setAttribute("data-theme-id", theme.id);
    
    // If the theme is light-based, set light theme, else set dark theme
    if (theme.tags.includes("light")) {
      root.classList.remove("dark");
      root.classList.add("light");
      
      // Store theme preference in localStorage
      localStorage.setItem('vscode-theme-preference', 'light');
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      
      // Store theme preference in localStorage
      localStorage.setItem('vscode-theme-preference', 'dark');
    }
    
    // Dispatch a custom event that ThemeProvider can listen for
    window.dispatchEvent(new CustomEvent('extension-theme-changed', { 
      detail: { 
        isUsingExtensionTheme: true,
        themeColors: theme.themeColors 
      }
    }));
  }, []);
  
  // Reset to default theme - implement directly without useTheme dependency
  const resetToDefaultTheme = useCallback(() => {
    const root = document.documentElement;
    
    // Remove all custom theme properties
    const customProps = Array.from(root.style).filter(prop => prop.startsWith('--'));
    customProps.forEach(prop => {
      root.style.removeProperty(prop);
    });
    
    // Get the stored theme preference, or default to dark
    const storedTheme = localStorage.getItem('vscode-theme-preference') || 'dark';
    
    // Apply default theme
    if (storedTheme === 'light') {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    
    // Mark document as not using theme extension
    root.setAttribute("data-using-extension-theme", "false");
    root.removeAttribute("data-theme-id");
    
    // Dispatch a custom event that ThemeProvider can listen for
    window.dispatchEvent(new CustomEvent('extension-theme-changed', { 
      detail: { 
        isUsingExtensionTheme: false 
      }
    }));
  }, []);

  const installExtension = (extension: Extension) => {
    // Register the extension to preserve functions
    registerExtension(extension);
    
    setInstalledExtensions(prev => {
      // Check if extension is already installed
      if (prev.some(ext => ext.id === extension.id)) {
        toast({
          title: "Already Installed",
          description: `${extension.name} is already installed.`,
        });
        return prev;
      }
      
      // Add the extension with installed flag, but not enabled by default
      const newExtension = { ...extension, installed: true, enabled: false };
      
      toast({
        title: "Extension Installed",
        description: `${extension.name} has been successfully installed.`,
      });
      
      // Run the onInstall function if provided
      if (extension.onInstall) {
        safeExecuteExtensionFunction(extension, 'onInstall');
      }
      
      // Return updated extensions list
      return [...prev, newExtension];
    });
  };
  
  const uninstallExtension = (extensionId: string) => {
    setInstalledExtensions(prev => {
      const extension = prev.find(ext => ext.id === extensionId);
      if (!extension) return prev;

      // Execute cleanup function if the extension was enabled
      if (extension.enabled) {
        // If it's a theme, reset to default theme
        if (extension.extensionType === "theme") {
          resetToDefaultTheme();
        }
        
        // Run onDisable function
        if (extension.onDisable) {
          safeExecuteExtensionFunction(extension, 'onDisable');
        }
      }
      
      // Run onUninstall function
      if (extension.onUninstall) {
        safeExecuteExtensionFunction(extension, 'onUninstall');
      }
      
      toast({
        title: "Extension Uninstalled",
        description: `${extension.name} has been uninstalled.`,
      });
      
      return prev.filter(ext => ext.id !== extensionId);
    });
  };
  
  const enableExtension = (extensionId: string) => {
    setInstalledExtensions(prev => {
      const extension = prev.find(ext => ext.id === extensionId);
      if (!extension) return prev;
      
      // Special handling for theme extensions - disable any other active theme
      if (extension.extensionType === "theme") {
        // First, find and disable any currently active theme
        const activeTheme = prev.find(ext => ext.extensionType === "theme" && ext.enabled);
        if (activeTheme && activeTheme.onDisable) {
          safeExecuteExtensionFunction(activeTheme, 'onDisable');
        }
        
        const updatedExts = prev.map(ext => 
          ext.extensionType === "theme" && ext.enabled ? 
            { ...ext, enabled: false } : ext
        );
        
        // Then apply this theme
        applyTheme(extension);
        
        // Execute the theme's onEnable function if it exists
        if (extension.onEnable) {
          safeExecuteExtensionFunction(extension, 'onEnable');
        }
        
        toast({
          title: `${extension.name} Enabled`,
          description: `The theme "${extension.name}" has been applied to the website.`,
        });
        
        // Return updated list with this theme enabled and others disabled
        return updatedExts.map(ext => 
          ext.id === extensionId ? { ...ext, enabled: true } : ext
        );
      } else {
        // For non-theme extensions, just enable it
        let success = true;
        
        try {
          // Register extension commands if available
          if (extension.commands && Array.isArray(extension.commands)) {
            extension.commands.forEach(cmd => {
              if (window.vscodeExtensionApi) {
                window.vscodeExtensionApi.registerCommand(cmd.id, (...args: any[]) => {
                  // Here we could implement the actual command functionality
                  console.log(`Executing command: ${cmd.id} with args:`, args);
                  
                  // If the extension defines a registerCommands function, use that
                  if (extension.registerCommands) {
                    try {
                      return extension.registerCommands();
                    } catch (error) {
                      console.error(`Error registering commands for ${extension.name}:`, error);
                    }
                  }
                  
                  return null;
                });
              }
            });
          }
          
          // Run onEnable function if it exists
          if (extension.onEnable) {
            success = safeExecuteExtensionFunction(extension, 'onEnable');
          }
          
          // Mark extension as successfully enabled in toast if onEnable succeeded
          if (success) {
            toast({
              title: `${extension.name} Enabled`,
              description: `${extension.name} has been successfully enabled.`,
            });
          }
        } catch (error) {
          console.error(`Error enabling ${extension.name}:`, error);
          success = false;
          
          toast({
            title: "Extension Error",
            description: `Failed to enable ${extension.name}. Please try again.`,
            variant: "destructive",
          });
        }
        
        // Don't mark it as enabled if the function failed
        if (!success) return prev;
        
        // Return updated list with this extension enabled
        return prev.map(ext => 
          ext.id === extensionId ? { ...ext, enabled: true } : ext
        );
      }
    });
  };
  
  const disableExtension = (extensionId: string) => {
    setInstalledExtensions(prev => {
      const extension = prev.find(ext => ext.id === extensionId);
      if (!extension) return prev;
      
      // If it's a theme, reset to default
      if (extension.extensionType === "theme") {
        resetToDefaultTheme();
        
        toast({
          title: `Theme Disabled`,
          description: `The theme "${extension.name}" has been disabled. Reverting to default theme.`,
        });
      } else {
        // Run disable function for non-theme extensions
        if (extension.onDisable) {
          safeExecuteExtensionFunction(extension, 'onDisable');
        }
        
        toast({
          title: `${extension.name} Disabled`,
          description: `${extension.name} has been disabled.`,
        });
      }
      
      // Return updated extensions list with this one disabled
      return prev.map(ext => 
        ext.id === extensionId ? { ...ext, enabled: false } : ext
      );
    });
  };

  const toggleExtension = (extensionId: string) => {
    const extension = installedExtensions.find(ext => ext.id === extensionId);
    if (!extension) return;
    
    if (extension.enabled) {
      disableExtension(extensionId);
    } else {
      enableExtension(extensionId);
    }
  };
  
  const isExtensionInstalled = (extensionId: string): boolean => {
    return installedExtensions.some(ext => ext.id === extensionId);
  };

  const isExtensionEnabled = (extensionId: string): boolean => {
    const extension = installedExtensions.find(ext => ext.id === extensionId);
    return extension ? extension.enabled : false;
  };
  
  const getActiveTheme = (): Extension | null => {
    return installedExtensions.find(ext => ext.extensionType === "theme" && ext.enabled) || null;
  };
  
  const getActiveThemeColors = (): Record<string, string> => {
    const activeTheme = getActiveTheme();
    return activeTheme?.themeColors || {};
  };

  const getExtensionCommands = (): { id: string; title: string; keybinding?: string; extensionId: string }[] => {
    return installedExtensions.flatMap(ext => 
      ext.commands?.map(cmd => ({ ...cmd, extensionId: ext.id })) || []
    );
  };

  const executeCommand = (commandId: string, ...args: any[]) => {
    const command = getExtensionCommands().find(cmd => cmd.id === commandId);
    if (!command) {
      console.warn(`Command ${commandId} not found`);
      return null;
    }
    const extension = installedExtensions.find(ext => ext.id === command.extensionId);
    if (!extension || !extension.enabled) {
      console.warn(`Extension ${command.extensionId} is not enabled`);
      return null;
    }
    try {
      return window.vscodeExtensionApi?.executeCommand(commandId, ...args);
    } catch (error) {
      console.error(`Error executing command ${commandId}:`, error);
      return null;
    }
  };
  
  const getExtensionById = (extensionId: string): Extension | undefined => {
    return installedExtensions.find(ext => ext.id === extensionId);
  };
  
  const configureExtension = (extensionId: string, config: any) => {
    const extension = installedExtensions.find(ext => ext.id === extensionId);
    if (!extension || !extension.configurable) {
      console.warn(`Extension ${extensionId} is not configurable or not found`);
      return;
    }
    
    // Store extension configuration in window.extensionData
    window.extensionData[extensionId] = {
      ...(window.extensionData[extensionId] || {}),
      config
    };
    
    // Notify the user
    toast({
      title: "Extension Configured",
      description: `Configuration for ${extension.name} has been updated.`,
    });
    
    // If the extension is enabled, attempt to reload it
    if (extension.enabled) {
      // Disable then re-enable to apply new config
      disableExtension(extensionId);
      setTimeout(() => {
        enableExtension(extensionId);
      }, 100);
    }
  };
  
  const value = {
    installedExtensions,
    installExtension,
    uninstallExtension,
    enableExtension,
    disableExtension,
    toggleExtension,
    isExtensionInstalled,
    isExtensionEnabled,
    getActiveTheme,
    getActiveThemeColors,
    getExtensionCommands,
    executeCommand,
    getExtensionById,
    configureExtension
  };
  
  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  );
};