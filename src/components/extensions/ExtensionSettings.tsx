import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Extension, useExtensions } from "@/contexts/ExtensionContext";
import { toast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";

interface ExtensionSettingsProps {
  extensionId: string;
}

const ExtensionSettings: React.FC<ExtensionSettingsProps> = ({ extensionId }) => {
  const { installedExtensions } = useExtensions();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  const extension = installedExtensions.find(ext => ext.id === extensionId);
  
  useEffect(() => {
    if (extension?.configuration?.properties) {
      // Load saved settings from localStorage or use defaults from the extension
      const savedSettings = localStorage.getItem(`extension_settings_${extensionId}`);
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error("Failed to parse extension settings", e);
          // Fall back to defaults
          initializeDefaultSettings();
        }
      } else {
        initializeDefaultSettings();
      }
    }
  }, [extensionId, extension]);

  const initializeDefaultSettings = () => {
    if (!extension?.configuration?.properties) return;
    
    const defaults: Record<string, any> = {};
    Object.entries(extension.configuration.properties).forEach(([key, config]) => {
      defaults[key] = config.default;
    });
    setSettings(defaults);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(`extension_settings_${extensionId}`, JSON.stringify(settings));
      
      // Notify extension of settings change by dispatching an event
      if (window.vscodeExtensionApi) {
        const settingsEvent = new CustomEvent("extensionSettingsChanged", {
          detail: { extensionId, settings }
        });
        document.dispatchEvent(settingsEvent);
      }
      
      toast({
        title: "Settings Saved",
        description: "Your extension settings have been saved."
      });
      setHasChanges(false);
    } catch (e) {
      console.error("Failed to save extension settings", e);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!extension || !extension.configurable) {
    return <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">This extension doesn't have any configurable settings.</p>
      </CardContent>
    </Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {extension.name} Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {extension.configuration?.properties && Object.entries(extension.configuration.properties).map(([key, config]) => {
          const value = settings[key];
          
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="font-medium">
                {config.title || key}
              </Label>
              {config.description && (
                <p className="text-sm text-muted-foreground">{config.description}</p>
              )}
              
              {/* Render different control types based on the property type */}
              {config.type === "boolean" && (
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={key} 
                    checked={Boolean(value)}
                    onCheckedChange={checked => handleSettingChange(key, checked)} 
                  />
                  <Label htmlFor={key}>{value ? "Enabled" : "Disabled"}</Label>
                </div>
              )}
              
              {config.type === "string" && !config.enum && (
                <Input 
                  id={key}
                  value={value || ""}
                  onChange={e => handleSettingChange(key, e.target.value)}
                />
              )}
              
              {config.type === "number" && (
                config.range ? (
                  <div className="py-4">
                    <Slider 
                      defaultValue={[value || config.default || 0]}
                      min={config.range[0]}
                      max={config.range[1]}
                      step={config.step || 1}
                      onValueChange={values => handleSettingChange(key, values[0])}
                    />
                    <p className="text-sm text-right text-muted-foreground mt-1">{value}</p>
                  </div>
                ) : (
                  <Input 
                    id={key}
                    type="number"
                    value={value || 0}
                    onChange={e => handleSettingChange(key, Number(e.target.value))}
                  />
                )
              )}
              
              {config.enum && (
                <Select 
                  value={value}
                  onValueChange={val => handleSettingChange(key, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={config.placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {config.enum.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {config.type === "array" && config.items && (
                <div className="space-y-2">
                  {(config.items as string[]).map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`${key}-${idx}`}
                        checked={(value || []).includes(item)}
                        onCheckedChange={checked => {
                          const newValue = [...(value || [])];
                          if (checked) {
                            newValue.push(item);
                          } else {
                            const index = newValue.indexOf(item);
                            if (index !== -1) {
                              newValue.splice(index, 1);
                            }
                          }
                          handleSettingChange(key, newValue);
                        }}
                      />
                      <Label htmlFor={`${key}-${idx}`}>{item}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {hasChanges && (
          <Button onClick={saveSettings} className="w-full mt-4" variant="default">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtensionSettings;