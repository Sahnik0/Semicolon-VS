import React from "react";
import { Code, X } from "lucide-react";

interface VSCodeTabProps {
  title: string;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
}

const VSCodeTab: React.FC<VSCodeTabProps> = ({ title, active, onSelect, onClose }) => {
  return (
    <div
      className={`vscode-tab ${active ? "active" : ""}`}
      onClick={onSelect}
    >
      <Code className="w-4 h-4" />
      <span className="text-sm truncate">{title}</span>
      <button 
        className="ml-2 opacity-50 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

interface VSCodeTabsProps {
  tabs: Array<{ id: string; title: string }>;
  activeTab: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

const VSCodeTabs: React.FC<VSCodeTabsProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  onCloseTab,
}) => {
  return (
    <div className="flex overflow-x-auto bg-secondary dark:bg-secondary text-foreground">
      {tabs.map((tab) => (
        <VSCodeTab
          key={tab.id}
          title={tab.title}
          active={tab.id === activeTab}
          onSelect={() => onSelectTab(tab.id)}
          onClose={() => onCloseTab(tab.id)}
        />
      ))}
    </div>
  );
};

export default VSCodeTabs;
