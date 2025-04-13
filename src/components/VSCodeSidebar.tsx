
import React, { useState } from "react";
import { 
  FileCode, 
  Search, 
  GitBranch, 
  Bug, 
  Package, 
  Calendar,
  Home,
  ChevronLeft,
  ChevronRight,
  Code,
  File
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface ActivityBarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const ActivityBarItem: React.FC<ActivityBarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`w-12 h-12 flex items-center justify-center transition-colors ${
              active 
                ? "text-white border-l-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={onClick}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div
      className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 ${
        active 
          ? "bg-accent text-foreground" 
          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
};

interface UserFile {
  id: string;
  title: string;
}

interface VSCodeSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userFiles?: UserFile[];
}

const VSCodeSidebar: React.FC<VSCodeSidebarProps> = ({ 
  activeSection, 
  onSectionChange,
  userFiles = [] 
}) => {
  const [activeView, setActiveView] = useState<string>("explorer");
  const [previousView, setPreviousView] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  const activityBarItems = [
    { id: "explorer", icon: <FileCode size={24} />, label: "Explorer" },
    { id: "search", icon: <Search size={24} />, label: "Search" },
    { id: "git", icon: <GitBranch size={24} />, label: "Source Control" },
    { id: "debug", icon: <Bug size={24} />, label: "Run and Debug" },
    { id: "extensions", icon: <Package size={24} />, label: "Extensions" },
  ];

  const sidebarItems = {
    explorer: [
      { id: "home", label: "Home.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
      { id: "about", label: "About.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
      { id: "timeline", label: "Timeline.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
      { id: "tracks", label: "Tracks.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
      { id: "judges", label: "Judges.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
      { id: "team", label: "Team.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
      { id: "faq", label: "FAQ.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
      { id: "sponsors", label: "Sponsors.tsx", icon: <FileCode size={16} className="text-blue-400" /> },
    ],
    search: [
      { id: "search-results", label: "Search Results", icon: <Search size={16} /> },
    ],
    git: [
      { id: "changes", label: "Changes", icon: <GitBranch size={16} /> },
      { id: "commits", label: "Commits", icon: <Code size={16} /> },
    ],
    debug: [
      { id: "debug-console", label: "Debug Console", icon: <Bug size={16} /> },
    ],
    extensions: [
      { id: "installed", label: "Installed", icon: <Package size={16} /> },
      { id: "marketplace", label: "Marketplace", icon: <Package size={16} /> },
    ],
  };

  const handleActivityItemClick = (id: string) => {
    // If clicking the same item that's already active, toggle sidebar expansion
    if (id === activeView) {
      setPreviousView(activeView);
      setSidebarExpanded(!sidebarExpanded);
    } else {
      // When changing views, ensure sidebar is expanded
      setSidebarExpanded(true);
      setActiveView(id);
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex h-full">
      {/* Activity Bar */}
      <div className="w-12 flex flex-col bg-vscode-activitybar-dark dark:bg-vscode-activitybar-dark">
        {activityBarItems.map((item) => (
          <ActivityBarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            onClick={() => handleActivityItemClick(item.id)}
          />
        ))}
      </div>

      {/* Sidebar */}
      <div 
        className={cn(
          "bg-[#f3f3f3] dark:bg-vscode-dark-sidebar border-r border-border overflow-y-auto transition-all duration-300 ease-in-out",
          sidebarExpanded ? "w-48 lg:w-60" : "w-0"
        )}
      >
        {sidebarExpanded && (
          <div className="py-2">
            <div className="text-xs uppercase px-4 py-1 text-muted-foreground flex items-center justify-between">
              <div className="flex items-center">
                {activeView === "explorer" ? (
                  <>
                    <span className="mr-2">HACKATHON-2025</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14 4.52v-.41l-2.02-.63L10.54 2 9.71 3.5l-2.02.63.31 1.65-.58.53-1.5-.39L4.6 7.15l.9 1.31-.21.98L4 10.08l.56 1.56 1.34-.26.67.85-.24 1.33 1.68.24 1.2-.95.92.47 1.05-1.29.49.12.73 1.36.89-1.3 1.13-.18.3-1.41-.61-.74 1.05-1.01-.43-1.25-.96-.25.02-.76 1.48-.36L14 4.52zM9.64 8.35l-.84.79-.84-.79.84-.79.84.79z" />
                    </svg>
                  </>
                ) : (
                  activeView.toUpperCase()
                )}
              </div>
              <button 
                onClick={toggleSidebar} 
                className="hover:bg-accent rounded p-1"
                aria-label="Toggle sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
            
            {/* Built-in section items */}
            <div className="mt-2">
              {sidebarItems[activeView as keyof typeof sidebarItems]?.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeSection === item.id}
                  onClick={() => onSectionChange(item.id)}
                />
              ))}
            </div>
            
            {/* User-created files section */}
            {activeView === "explorer" && userFiles.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase px-4 py-1 text-muted-foreground">
                  USER FILES
                </div>
                {userFiles.map((file) => (
                  <SidebarItem
                    key={file.id}
                    icon={<File size={16} className="text-orange-400" />}
                    label={file.title}
                    active={activeSection === file.id}
                    onClick={() => onSectionChange(file.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Toggle button for collapsed sidebar */}
      {!sidebarExpanded && (
        <button 
          onClick={toggleSidebar}
          className="h-8 w-5 flex items-center justify-center bg-[#f3f3f3] dark:bg-secondary/80 text-muted-foreground hover:text-foreground border-y border-r border-border rounded-r"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default VSCodeSidebar;
