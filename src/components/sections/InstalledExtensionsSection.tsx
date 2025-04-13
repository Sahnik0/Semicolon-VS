import React from "react";
import { Package, AlertCircle } from "lucide-react";
import InstalledExtensionItem from "../extensions/InstalledExtensionItem";
import { Button } from "@/components/ui/button";
import { useExtensions } from "@/contexts/ExtensionContext";
import { Input } from "@/components/ui/input";

const InstalledExtensionsSection: React.FC = () => {
  const { installedExtensions } = useExtensions();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter extensions based on search query
  const filteredExtensions = React.useMemo(() => {
    if (!searchQuery.trim()) return installedExtensions;
    
    const query = searchQuery.toLowerCase();
    return installedExtensions.filter(
      ext => 
        ext.name.toLowerCase().includes(query) || 
        ext.description.toLowerCase().includes(query) ||
        ext.publisher.toLowerCase().includes(query)
    );
  }, [installedExtensions, searchQuery]);

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Installed Extensions</h2>
      
      {installedExtensions.length > 0 && (
        <div className="mb-6">
          <Input
            placeholder="Search installed extensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      )}
      
      {installedExtensions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExtensions.map((extension) => (
              <InstalledExtensionItem key={extension.id} extension={extension} />
            ))}
          </div>
          
          {filteredExtensions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No extensions match your search.
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-secondary/50 p-4 rounded-full mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Extensions Installed</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Extensions add new features, themes, and productivity tools to enhance your experience.
          </p>
          <Button 
            onClick={() => document.dispatchEvent(new CustomEvent('navigate-section', { detail: 'marketplace' }))}
          >
            Browse Marketplace
          </Button>
        </div>
      )}
      
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800/50 rounded-md p-4 text-sm flex gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Extension Settings</h4>
          <p className="text-yellow-700 dark:text-yellow-400/80">
            Extensions may change the appearance and functionality of the site. You can enable or 
            disable extensions at any time, and uninstall them if you no longer need them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstalledExtensionsSection;