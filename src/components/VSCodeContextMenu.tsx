
import React, { useRef, useEffect, useState } from "react";
import { Copy, RefreshCw, Settings, FileText, Download, ExternalLink, Code } from "lucide-react";

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  separator?: boolean;
}

interface VSCodeContextMenuProps {
  items?: ContextMenuItem[];
  onClose: () => void;
  position: { x: number; y: number };
}

const defaultItems: ContextMenuItem[] = [
  { label: "Copy", icon: <Copy className="w-4 h-4" />, onClick: () => console.log("Copy") },
  { label: "Refresh", icon: <RefreshCw className="w-4 h-4" />, onClick: () => window.location.reload() },
  { label: "separator", separator: true },
  { label: "View Source", icon: <FileText className="w-4 h-4" />, onClick: () => console.log("View Source") },
  { label: "Open DevTools", icon: <Settings className="w-4 h-4" />, onClick: () => console.log("DevTools") },
  { label: "separator", separator: true },
  { label: "View Code Snippet", icon: <Code className="w-4 h-4" />, onClick: () => console.log("View Code Snippet") },
  { label: "Download Brochure", icon: <Download className="w-4 h-4" />, onClick: () => console.log("Download") },
  { label: "Register Now", icon: <ExternalLink className="w-4 h-4" />, onClick: () => window.open("https://example.com/register", "_blank") },
];

export const VSCodeContextMenu: React.FC<VSCodeContextMenuProps> = ({ 
  items = defaultItems, 
  onClose,
  position,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Adjust position if menu would go off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newPos = { ...position };
      
      if (position.x + rect.width > window.innerWidth) {
        newPos.x = window.innerWidth - rect.width - 10;
      }
      
      if (position.y + rect.height > window.innerHeight) {
        newPos.y = window.innerHeight - rect.height - 10;
      }
      
      setAdjustedPosition(newPos);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, position]);

  return (
    <div 
      ref={menuRef}
      className="vscode-context-menu"
      style={{ 
        left: `${adjustedPosition.x}px`, 
        top: `${adjustedPosition.y}px` 
      }}
    >
      {items.map((item, index) => (
        item.separator ? (
          <div key={`sep-${index}`} className="vscode-context-menu-separator" />
        ) : (
          <div
            key={`item-${index}`}
            className="vscode-context-menu-item"
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        )
      ))}
    </div>
  );
};

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    position: { x: number; y: number };
  }>({
    show: false,
    position: { x: 0, y: 0 },
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, show: false }));
  };

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
  };
};
