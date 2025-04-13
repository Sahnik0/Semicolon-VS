
import React from "react";

interface VSCodeStatusBarProps {
  children?: React.ReactNode;
}

const VSCodeStatusBar: React.FC<VSCodeStatusBarProps> = ({ children }) => {
  return (
    <div className="h-6 flex items-center px-2 text-xs bg-vscode-statusbar dark:bg-vscode-statusbar border-t border-border dark:border-[#333] relative z-20">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <span className="mr-2">main</span>
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.2 1H8.017l-1.058.545L3.025 1H2v13l1.025-.545L6.959 14l1.058-.545L12 14l1.2-.636V1zM7.984 2H11v10l-2.016-1.103L7.984 12V2zM5 12V2H3v10l2 1V12z" />
          </svg>
        </div>
        <div className="flex items-center">
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 6.5a.5.5 0 00-.5.5v3a.5.5 0 001 0V7a.5.5 0 00-.5-.5zm1-3a1 1 0 10-2 0 1 1 0 002 0zM8 9a1 1 0 110 2 1 1 0 010-2z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M14.4 5.375a7 7 0 100 5.25.75.75 0 01.6.75.75.75 0 01-.6.75 8.5 8.5 0 110-7.5.75.75 0 11-.6.75.75.75 0 01.6.75z" />
            <path d="M11.344 11.344a4.5 4.5 0 10-6.688-6.688 4.5 4.5 0 006.688 6.688z" />
          </svg>
          <span className="ml-1">Connected</span>
        </div>
      </div>
      <div className="flex-1 flex items-center">
        {children}
      </div>
    </div>
  );
};

export default VSCodeStatusBar;
