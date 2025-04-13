import React from 'react';
import { Bell, Circle, Terminal, CircleX, AlertTriangle, Share2, Wifi, Code, Zap, GitBranch } from 'lucide-react';

interface VSCodeFooterProps {
  onToggleTerminal: () => void;
}

const VSCodeFooter: React.FC<VSCodeFooterProps> = ({ onToggleTerminal }) => {
  return (
    <div className="h-7 bg-vscode-statusbar border-t border-border flex items-center text-xs text-primary-foreground">
      <div className="flex items-center px-2 space-x-4">
        <button className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded" aria-label="main">
          <GitBranch className="h-3.5 w-3.5 mr-1" />
          <span>main</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded" aria-label="BLACKBOX Chat">
            <Zap className="h-3.5 w-3.5 mr-1" />
            <span>BLACKBOX Chat</span>
          </button>
          
          <button className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded" aria-label="Add Logs">
            <Terminal className="h-3.5 w-3.5 mr-1" />
            <span>Add Logs</span>
          </button>

                  
          <button className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded" aria-label="Share Code Link">
            <Share2 className="h-3.5 w-3.5 mr-1" />
            <span>Share Code Link</span>
          </button>

          <button className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded" aria-label="Go Live">
            <Wifi className="h-3.5 w-3.5 mr-1" />
            <span>Go Live</span>
          </button>

          <button className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded" aria-label="AI Code Chat">
            <Zap className="h-3.5 w-3.5 mr-1" />
            <span>AI Code Chat</span>
          </button>

          <button className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded" aria-label="Prettier">
            <Bell className="h-3.5 w-3.5 mr-1" />
            <span>Prettier</span>
          </button>
        </div>
      </div>

      <div className="ml-auto flex items-center space-x-2 px-2">
        <button 
          className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded"
          onClick={onToggleTerminal}
          aria-label="Open Terminal"
        >
          <Terminal className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default VSCodeFooter;
