import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, ToggleRight, ToggleLeft } from "lucide-react";
import { Extension, useExtensions } from "@/contexts/ExtensionContext";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InstalledExtensionItemProps {
  extension: Extension;
}

const InstalledExtensionItem: React.FC<InstalledExtensionItemProps> = ({ extension }) => {
  const { uninstallExtension, enableExtension, disableExtension } = useExtensions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      if (extension.enabled) {
        disableExtension(extension.id);
        toast({
          title: "Extension Disabled",
          description: `"${extension.name}" has been disabled.`,
        });
      } else {
        enableExtension(extension.id);
        toast({
          title: "Extension Enabled",
          description: `"${extension.name}" has been enabled.`,
        });
      }
    } finally {
      setIsToggling(false);
    }
  };

  const handleUninstall = async () => {
    setIsUninstalling(true);
    try {
      setShowDeleteDialog(false);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate uninstall delay
      uninstallExtension(extension.id);
      toast({
        title: "Extension Uninstalled",
        description: `"${extension.name}" has been uninstalled successfully.`,
      });
    } finally {
      setIsUninstalling(false);
    }
  };

  return (
    <>
      <Card className={`h-full ${!extension.enabled ? 'opacity-70' : ''} hover:shadow-md transition-colors`}>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <img src={extension.icon} alt={extension.name} className="w-12 h-12 rounded" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{extension.name}</h3>
              <Badge variant="outline" className="text-xs">v{extension.version}</Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{extension.publisher}</p>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{extension.description}</p>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2 justify-between flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isToggling || isUninstalling}
            className="flex-grow"
          >
            {extension.enabled ? (
              <>
                <ToggleRight className="h-4 w-4 mr-1" />
                {isToggling ? "Disabling..." : "Disable"}
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4 mr-1" />
                {isToggling ? "Enabling..." : "Enable"}
              </>
            )}
          </Button>
          
          {extension.features && (
            <Button
              variant="outline"
              size="sm"
              className="flex-grow"
              disabled={!extension.enabled || isUninstalling}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isUninstalling}
            className="flex-grow"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isUninstalling ? "Uninstalling..." : "Uninstall"}
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will uninstall "{extension.name}" and remove any settings associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUninstalling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUninstall}
              disabled={isUninstalling}
            >
              {isUninstalling ? "Uninstalling..." : "Uninstall"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InstalledExtensionItem;