import React, { useState, useEffect } from "react";
import { useExtensions } from "@/contexts/ExtensionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Type for dependency map
type DependencyMap = {
  [extensionId: string]: {
    dependsOn: string[];
    requiredBy: string[];
  }
};

const ExtensionDependencies = () => {
  const { 
    installedExtensions, 
    installExtension, 
    uninstallExtension 
  } = useExtensions();
  
  const [dependencyMap, setDependencyMap] = useState<DependencyMap>({});
  const [missingDependencies, setMissingDependencies] = useState<{
    extensionId: string;
    missingDeps: string[];
  }[]>([]);
  
  // Build dependency map
  useEffect(() => {
    const buildDependencyMap = () => {
      const depMap: DependencyMap = {};
      
      // Initialize map with all installed extensions
      installedExtensions.forEach(ext => {
        depMap[ext.id] = {
          dependsOn: ext.dependencies || [],
          requiredBy: []
        };
      });
      
      // Populate requiredBy relationships
      installedExtensions.forEach(ext => {
        const dependencies = ext.dependencies || [];
        dependencies.forEach(depId => {
          if (depMap[depId]) {
            depMap[depId].requiredBy.push(ext.id);
          }
        });
      });
      
      // Find missing dependencies
      const missing = [];
      installedExtensions.forEach(ext => {
        const dependencies = ext.dependencies || [];
        const missingDeps = dependencies.filter(depId => 
          !installedExtensions.some(installed => installed.id === depId)
        );
        
        if (missingDeps.length > 0) {
          missing.push({
            extensionId: ext.id,
            missingDeps
          });
        }
      });
      
      setDependencyMap(depMap);
      setMissingDependencies(missing);
    };
    
    buildDependencyMap();
  }, [installedExtensions]);
  
  // Install missing dependencies
  const installMissingDependencies = async (extensionId: string, missingDeps: string[]) => {
    try {
      // This would typically call a marketplace API to find extension details
      // For now, we'll show a notification
      toast({
        title: "Missing Dependencies",
        description: `Attempting to install dependencies for ${extensionId}: ${missingDeps.join(", ")}`,
        variant: "default"
      });
      
      // Mock implementation - in a real system, this would fetch from an extension registry
      for (const depId of missingDeps) {
        // In a real implementation, you would get extension details from a registry
        const mockExtension = {
          id: depId,
          name: `${depId} Extension`,
          description: `Auto-installed dependency for ${extensionId}`,
          version: "1.0.0",
          author: "System",
          dependencies: []
        };
        
        await installExtension(mockExtension);
      }
      
      toast({
        title: "Dependencies Installed",
        description: "All missing dependencies have been installed",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Installation Failed",
        description: "Failed to install one or more dependencies",
        variant: "destructive"
      });
    }
  };
  
  // Check if it's safe to uninstall an extension
  const canSafelyUninstall = (extensionId: string) => {
    return !dependencyMap[extensionId]?.requiredBy.length;
  };
  
  // Uninstall an extension and its unique dependencies
  const safeUninstallExtension = (extensionId: string) => {
    const extension = installedExtensions.find(ext => ext.id === extensionId);
    if (!extension) return;
    
    if (!canSafelyUninstall(extensionId)) {
      toast({
        title: "Cannot Uninstall",
        description: `${extension.name} is required by other extensions. Please uninstall those first.`,
        variant: "destructive"
      });
      return;
    }
    
    // Get dependencies that are only required by this extension
    const uniqueDependencies = Object.entries(dependencyMap)
      .filter(([depId, info]) => 
        info.requiredBy.length === 1 && 
        info.requiredBy[0] === extensionId
      )
      .map(([depId]) => depId);
    
    // Uninstall the extension
    uninstallExtension(extensionId);
    
    // Offer to uninstall unique dependencies
    if (uniqueDependencies.length > 0) {
      const uniqueDepNames = uniqueDependencies.map(depId => 
        installedExtensions.find(ext => ext.id === depId)?.name || depId
      ).join(", ");
      
      toast({
        title: "Orphaned Dependencies",
        description: `Do you want to uninstall dependencies that are no longer needed? ${uniqueDepNames}`,
        action: (
          <Button 
            onClick={() => uniqueDependencies.forEach(uninstallExtension)}
            variant="outline"
            size="sm"
          >
            Uninstall
          </Button>
        )
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Extension Dependencies</CardTitle>
        <CardDescription>
          Manage extension dependencies and resolve conflicts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {missingDependencies.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <h3 className="flex items-center mb-2 text-yellow-500">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Missing Dependencies
            </h3>
            <div className="space-y-2">
              {missingDependencies.map(({ extensionId, missingDeps }) => {
                const extension = installedExtensions.find(ext => ext.id === extensionId);
                return (
                  <div key={extensionId} className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{extension?.name || extensionId}</span> requires: {missingDeps.join(", ")}
                    </div>
                    <Button
                      onClick={() => installMissingDependencies(extensionId, missingDeps)}
                      size="sm"
                      variant="outline"
                    >
                      Install Dependencies
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {installedExtensions.map(extension => {
              const deps = dependencyMap[extension.id]?.dependsOn || [];
              const requiredBy = dependencyMap[extension.id]?.requiredBy || [];
              
              return (
                <div key={extension.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{extension.name}</h3>
                    <div className="flex items-center gap-2">
                      {canSafelyUninstall(extension.id) ? (
                        <Badge variant="outline" className="text-green-500 border-green-500">
                          <Check className="mr-1 h-3 w-3" />
                          Safe to Uninstall
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Required by Others
                        </Badge>
                      )}
                      
                      <Button
                        onClick={() => safeUninstallExtension(extension.id)}
                        size="sm"
                        variant="outline"
                        disabled={!canSafelyUninstall(extension.id)}
                      >
                        Uninstall
                      </Button>
                    </div>
                  </div>

                  {/* Dependencies */}
                  {deps.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Depends on:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {deps.map(depId => {
                          const depExt = installedExtensions.find(ext => ext.id === depId);
                          const isInstalled = !!depExt;
                          
                          return (
                            <Badge 
                              key={depId}
                              variant={isInstalled ? "outline" : "destructive"}
                              className="text-xs"
                            >
                              {depExt?.name || depId}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Required by */}
                  {requiredBy.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Required by:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {requiredBy.map(reqId => {
                          const reqExt = installedExtensions.find(ext => ext.id === reqId);
                          
                          return (
                            <Badge 
                              key={reqId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {reqExt?.name || reqId}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {installedExtensions.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No extensions installed
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExtensionDependencies;