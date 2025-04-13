import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, Check, ExternalLink, Star, Trash2, Power, PowerOff, 
  Settings, Info, ChevronDown, ChevronUp
} from "lucide-react";
import { Extension, useExtensions } from "@/contexts/ExtensionContext";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketplaceExtensionProps {
  extension: Extension;
}

const MarketplaceExtension: React.FC<MarketplaceExtensionProps> = ({ extension }) => {
  const { 
    installExtension, 
    uninstallExtension, 
    isExtensionInstalled, 
    isExtensionEnabled, 
    enableExtension, 
    disableExtension,
    getExtensionCommands
  } = useExtensions();
  
  const [isInstalling, setIsInstalling] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const installed = isExtensionInstalled(extension.id);
  const enabled = isExtensionEnabled(extension.id);
  const commands = extension.commands || [];

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
      installExtension(extension);
      
      // Optional: Enable extension after installation with a slight delay
      if (extension.extensionType !== "theme") {
        setTimeout(() => {
          enableExtension(extension.id);
        }, 500);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleToggle = async () => {
    setIsEnabling(true);
    try {
      // Simulate delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
      if (enabled) {
        disableExtension(extension.id);
      } else {
        enableExtension(extension.id);
      }
    } finally {
      setIsEnabling(false);
    }
  };

  const handleUninstall = async () => {
    try {
      uninstallExtension(extension.id);
    } catch (error) {
      console.error("Failed to uninstall extension:", error);
      toast({
        title: "Error",
        description: "Failed to uninstall the extension. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    if (extension.preview) {
      // Create a dialog that shows the preview image
      const previewDialog = document.createElement("dialog");
      previewDialog.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50";
      
      const previewContent = document.createElement("div");
      previewContent.className = "bg-card p-4 rounded-lg shadow-lg max-w-3xl max-h-[80vh] overflow-auto";
      previewContent.innerHTML = `
        <div class="flex justify-between mb-4">
          <h3 class="text-lg font-medium">${extension.name} Preview</h3>
          <button class="text-muted-foreground hover:text-foreground">×</button>
        </div>
        <img src="${extension.preview}" alt="${extension.name} preview" class="w-full rounded-md" />
      `;
      
      previewDialog.appendChild(previewContent);
      document.body.appendChild(previewDialog);
      
      previewDialog.showModal();
      
      const closeButton = previewContent.querySelector("button");
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          previewDialog.close();
          document.body.removeChild(previewDialog);
        });
      }
      
      previewDialog.addEventListener("click", (e) => {
        if (e.target === previewDialog) {
          previewDialog.close();
          document.body.removeChild(previewDialog);
        }
      });
    }
  };
  
  return (
    <Card className={`h-full hover:shadow-md transition-all ${enabled ? 'border-primary/30' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <img src={extension.icon} alt={extension.name} className="w-12 h-12 rounded" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{extension.name}</h3>
            <Badge variant="outline" className="text-xs">v{extension.version}</Badge>
            {enabled && <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>}
          </div>
          <p className="text-sm text-muted-foreground truncate">{extension.publisher}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-yellow-500" />
          <span className="text-xs">{extension.rating}</span>
          <Badge variant="outline" className="ml-2 text-xs">{extension.downloads.toLocaleString()} installs</Badge>
        </div>
      </CardHeader>
      <CardContent className={`pb-2 ${isExpanded ? '' : ''}`}>
        <p className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
          {extension.description}
        </p>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {extension.categories.slice(0, 2).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
          {extension.extensionType && (
            <Badge 
              variant="outline" 
              className={`text-xs ${
                extension.extensionType === 'theme' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 
                extension.extensionType === 'tool' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                'bg-orange-500/10 text-orange-600 border-orange-500/20'
              }`}>
              {extension.extensionType}
            </Badge>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-2 text-sm">
            {commands.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-medium text-xs uppercase text-muted-foreground">Commands</h4>
                <ul className="space-y-1">
                  {commands.map((cmd, i) => (
                    <li key={i} className="flex items-center justify-between bg-muted/40 px-2 py-1 rounded text-xs">
                      <span>{cmd.title}</span>
                      {cmd.keybinding && <kbd className="bg-background border px-1 py-0.5 rounded text-[10px]">{cmd.keybinding}</kbd>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {extension.features && extension.features.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-medium text-xs uppercase text-muted-foreground">Features</h4>
                <ul className="list-disc list-inside space-y-0.5">
                  {extension.features.map((feature, i) => (
                    <li key={i} className="text-xs">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 h-6 text-xs" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="h-3 w-3 ml-1" /></>
          ) : (
            <>Show More <ChevronDown className="h-3 w-3 ml-1" /></>
          )}
        </Button>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2 justify-between flex-wrap">
        {!installed ? (
          <Button
            className="flex-grow"
            size="sm"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling ? (
              <>Installing...</>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                Install
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              variant={enabled ? "outline" : "default"}
              size="sm"
              onClick={handleToggle}
              disabled={isEnabling}
              className="flex-grow"
            >
              {enabled ? (
                <>
                  <PowerOff className="h-4 w-4 mr-1" />
                  {isEnabling ? "Disabling..." : "Disable"}
                </>
              ) : (
                <>
                  <Power className="h-4 w-4 mr-1" />
                  {isEnabling ? "Enabling..." : "Enable"}
                </>
              )}
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleUninstall}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Uninstall extension</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreview} 
                disabled={!extension.preview}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview extension</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {extension.configurable && installed && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default MarketplaceExtension;