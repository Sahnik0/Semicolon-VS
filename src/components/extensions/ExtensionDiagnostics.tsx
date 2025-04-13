import React, { useState, useEffect } from "react";
import { useExtensions } from "@/contexts/ExtensionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const ExtensionDiagnostics = () => {
  const { 
    installedExtensions,
    enableExtension,
    disableExtension
  } = useExtensions();
  
  const [diagnosticResults, setDiagnosticResults] = useState<{
    id: string;
    name: string;
    status: "ok" | "warning" | "error";
    message: string;
    details?: string[];
  }[]>([]);
  
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Run diagnostic checks on all installed extensions
  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticResults([]);
    
    const results = [];
    
    // Check each extension
    for (const ext of installedExtensions) {
      try {
        // Check if extension has required properties
        const missingProps = [];
        if (!ext.id) missingProps.push("id");
        if (!ext.name) missingProps.push("name");
        if (!ext.description) missingProps.push("description");
        
        // Check for common extension errors
        const errors = [];
        const warnings = [];
        
        // Check if theme extensions have themeColors
        if (ext.extensionType === "theme" && (!ext.themeColors || Object.keys(ext.themeColors).length === 0)) {
          errors.push("Theme extension is missing themeColors property");
        }
        
        // Check if commands are properly defined
        if (ext.commands) {
          ext.commands.forEach((cmd, index) => {
            if (!cmd.id) errors.push(`Command at index ${index} is missing id property`);
            if (!cmd.title) errors.push(`Command at index ${index} is missing title property`);
          });
        }
        
        // Check for potential memory leaks in enabled extensions
        if (ext.enabled) {
          // Check if extension has registered cleanup functions
          if (!window.extensionCleanup[ext.id]) {
            warnings.push("No cleanup function registered, potential memory leak");
          }
        }
        
        // Create diagnostic result
        let status: "ok" | "warning" | "error" = "ok";
        let message = "Extension is working properly";
        
        if (errors.length > 0) {
          status = "error";
          message = `${errors.length} error(s) found`;
        } else if (warnings.length > 0) {
          status = "warning";
          message = `${warnings.length} warning(s) found`;
        }
        
        results.push({
          id: ext.id,
          name: ext.name,
          status,
          message,
          details: [...(missingProps.length > 0 ? [`Missing properties: ${missingProps.join(", ")}`] : []), ...errors, ...warnings]
        });
      } catch (error) {
        results.push({
          id: ext.id || "unknown",
          name: ext.name || "Unknown Extension",
          status: "error",
          message: "Exception occurred during diagnostic",
          details: [error instanceof Error ? error.message : String(error)]
        });
      }
    }
    
    setDiagnosticResults(results);
    setIsRunningDiagnostics(false);
    
    toast({
      title: "Diagnostics Complete",
      description: `Checked ${results.length} extensions`
    });
  };

  // Fix common issues with an extension
  const fixExtension = (extensionId: string) => {
    const ext = installedExtensions.find(e => e.id === extensionId);
    if (!ext) return;
    
    try {
      // Attempt to fix by disabling and re-enabling
      if (ext.enabled) {
        disableExtension(extensionId);
        setTimeout(() => {
          enableExtension(extensionId);
          toast({
            title: "Extension Reset",
            description: `${ext.name} has been reset. Please check if issues are resolved.`
          });
          runDiagnostics();
        }, 500);
      } else {
        enableExtension(extensionId);
        toast({
          title: "Extension Enabled",
          description: `${ext.name} has been enabled. Please check if issues are resolved.`
        });
        runDiagnostics();
      }
    } catch (error) {
      toast({
        title: "Fix Failed",
        description: `Unable to fix ${ext.name}. Try uninstalling and reinstalling.`,
        variant: "destructive"
      });
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: "ok" | "warning" | "error" }) => {
    const variants = {
      ok: "bg-green-500 hover:bg-green-600",
      warning: "bg-yellow-500 hover:bg-yellow-600",
      error: "bg-red-500 hover:bg-red-600"
    };
    
    return (
      <Badge className={variants[status]}>
        {status === "ok" ? "Healthy" : status === "warning" ? "Warning" : "Error"}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Extension Diagnostics</span>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunningDiagnostics}
            variant="outline"
            size="sm"
          >
            {isRunningDiagnostics ? "Running..." : "Run Diagnostics"}
          </Button>
        </CardTitle>
        <CardDescription>
          Troubleshoot issues with your installed extensions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {diagnosticResults.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Run diagnostics to check your extensions for issues
            </div>
          ) : (
            <div className="space-y-4">
              {diagnosticResults.map((result) => (
                <Collapsible key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={result.status} />
                      <span className="font-medium">{result.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.status !== "ok" && (
                        <Button 
                          onClick={() => fixExtension(result.id)}
                          size="sm"
                          variant="outline"
                        >
                          Attempt Fix
                        </Button>
                      )}
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    {result.message}
                  </div>
                  
                  <CollapsibleContent className="mt-4">
                    <Separator className="my-2" />
                    {result.details && result.details.length > 0 ? (
                      <ul className="space-y-1 text-sm">
                        {result.details.map((detail, i) => (
                          <li key={i} className="text-muted-foreground">• {detail}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No issues detected</div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExtensionDiagnostics;