import React, { useState, useEffect } from "react";
import VSCodeSidebar from "./VSCodeSidebar";
import VSCodeTabs from "./VSCodeTabs";
import VSCodeStatusBar from "./VSCodeStatusBar";
import VSCodeTerminal from "./VSCodeTerminal";
import VSCodeFooter from "./VSCodeFooter";
import { VSCodeContextMenu, useContextMenu } from "./VSCodeContextMenu";
import { ThemeProvider } from "../hooks/useTheme";
import NewFileDialog from "./NewFileDialog";
import VSCodeMenu from "./VSCodeMenu";
import { toast } from "@/hooks/use-toast";

interface VSCodeLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const VSCodeLayout: React.FC<VSCodeLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
}) => {
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
  const [showTerminal, setShowTerminal] = useState(false);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [userFiles, setUserFiles] = useState<{[key: string]: string}>({});
  
  const [tabs, setTabs] = useState([
    { id: activeSection, title: `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}.tsx` },
  ]);
  
  const [activeTab, setActiveTab] = useState(activeSection);

  useEffect(() => {
    // Update tabs when section changes
    if (!tabs.some(tab => tab.id === activeSection)) {
      setTabs(prev => [
        ...prev,
        { id: activeSection, title: `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}.tsx` }
      ]);
    }
    setActiveTab(activeSection);
  }, [activeSection, tabs]);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    onSectionChange(tabId);
  };

  const handleTabClose = (tabId: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(newTabs);
      
      // If the active tab is being closed, select another tab
      if (activeTab === tabId) {
        const newActiveTab = newTabs[0].id;
        setActiveTab(newActiveTab);
        onSectionChange(newActiveTab);
      }
      
      // Remove user file if it exists
      if (userFiles[tabId]) {
        const newUserFiles = {...userFiles};
        delete newUserFiles[tabId];
        setUserFiles(newUserFiles);
      }
    }
  };

  const handleDeleteFile = (fileId: string) => {
    // Remove the file from userFiles
    if (userFiles[fileId]) {
      const newUserFiles = {...userFiles};
      delete newUserFiles[fileId];
      setUserFiles(newUserFiles);
      
      // If the file is open in a tab, close it
      if (tabs.some(tab => tab.id === fileId)) {
        handleTabClose(fileId);
      }
      
      toast({
        title: "File Deleted",
        description: `File has been successfully deleted.`,
        duration: 2000,
      });
    }
  };

  const handleTerminalToggle = () => {
    setShowTerminal(prev => !prev);
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'newFile':
        setIsNewFileDialogOpen(true);
        break;
      case 'terminal':
        setShowTerminal(true);
        break;
      case 'help':
        onSectionChange('faq');
        break;
      case 'about':
        onSectionChange('about');
        break;
      case 'run':
      case 'runWithoutDebugging':
        setShowTerminal(true);
        break;
      default:
        // Handle dynamic navigation to sections
        if (action.startsWith('goTo')) {
          const section = action.replace('goTo', '').toLowerCase();
          onSectionChange(section);
        }
        break;
    }
  };

  const handleCreateNewFile = (fileName: string, type: string) => {
    const fileId = fileName.toLowerCase().replace(/\s+/g, '-').replace(/\.[^/.]+$/, '');
    
    // Determine file extension based on type
    let extension = '.tsx';
    if (type === 'component') {
      extension = '.tsx';
    } else if (type === 'utility') {
      extension = '.ts';
    } else if (type === 'stylesheet') {
      extension = '.css';
    } else if (type === 'json') {
      extension = '.json';
    } else if (type === 'html') {
      extension = '.html';
    } else if (type === 'markdown') {
      extension = '.md';
    } else if (type) {
      // Custom extension
      extension = type.startsWith('.') ? type : `.${type}`;
    }
    
    // Add new file to tabs with proper extension
    const newFileTitle = `${fileName}${extension}`;
    setTabs(prev => [...prev, { id: fileId, title: newFileTitle }]);
    
    // Add to user files with default content based on extension
    let defaultContent = '';
    if (extension === '.tsx') {
      defaultContent = `import React from 'react';\n\nconst ${fileName} = () => {\n  return (\n    <div>\n      {/* ${fileName} content goes here */}\n    </div>\n  );\n};\n\nexport default ${fileName};`;
    } else if (extension === '.ts') {
      defaultContent = `// ${fileName}.ts\n\n// Add your code here\n`;
    } else if (extension === '.css') {
      defaultContent = `/* ${fileName}.css */\n\n/* Add your styles here */\n`;
    } else if (extension === '.json') {
      defaultContent = `{\n  "name": "${fileName}",\n  "version": "1.0.0"\n}`;
    } else if (extension === '.html') {
      defaultContent = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${fileName}</title>\n</head>\n<body>\n  <!-- ${fileName} content goes here -->\n</body>\n</html>`;
    } else if (extension === '.md') {
      defaultContent = `# ${fileName}\n\nWrite your markdown content here.`;
    } else {
      defaultContent = `// ${fileName}${extension}\n\n// Add your code here\n`;
    }
    
    setUserFiles(prev => ({
      ...prev,
      [fileId]: defaultContent
    }));
    
    // Switch to the new tab
    setActiveTab(fileId);
    onSectionChange(fileId);
    
    setIsNewFileDialogOpen(false);
    
    toast({
      title: "File Created",
      description: `${newFileTitle} has been created successfully.`,
      duration: 2000,
    });
  };

  const handleFileContentChange = (fileId: string, content: string) => {
    setUserFiles(prev => ({
      ...prev,
      [fileId]: content
    }));
  };

  const renderContent = () => {
    // If it's a user-created file, render an editable area
    if (userFiles[activeTab]) {
      return (
        <div className="flex-1 overflow-auto p-4 bg-background dark:bg-[#1e1e1e]">
          <textarea
            className="w-full h-full bg-transparent border-none focus:outline-none font-mono text-sm"
            value={userFiles[activeTab]}
            onChange={(e) => handleFileContentChange(activeTab, e.target.value)}
            spellCheck={false}
          />
        </div>
      );
    }
    
    // Otherwise render the normal content
    return (
      <div className="flex-1 overflow-auto p-0 bg-background dark:bg-[#1e1e1e]">
        {children}
      </div>
    );
  };

  return (
    <ThemeProvider>
      <div 
        className="flex flex-col h-screen overflow-hidden bg-white text-black dark:bg-[#1e1e1e] dark:text-[#cccccc]"
        onContextMenu={handleContextMenu}
      >
        {/* Top navigation bar (mimicking VS Code) */}
        <VSCodeMenu 
          onAction={handleMenuAction}
          onSectionChange={onSectionChange}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <VSCodeSidebar 
            activeSection={activeSection} 
            onSectionChange={onSectionChange}
            userFiles={Object.keys(userFiles).map(id => ({ 
              id, 
              title: tabs.find(tab => tab.id === id)?.title || id 
            }))}
            onDeleteFile={handleDeleteFile}
          />
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <VSCodeTabs 
              tabs={tabs}
              activeTab={activeTab}
              onSelectTab={handleTabSelect}
              onCloseTab={handleTabClose}
            />
            
            {renderContent()}
          </div>
        </div>
        
        <VSCodeFooter onToggleTerminal={handleTerminalToggle} />
        
        <VSCodeTerminal isOpen={showTerminal} setIsOpen={setShowTerminal} />
        
        {contextMenu.show && (
          <VSCodeContextMenu
            position={contextMenu.position}
            onClose={closeContextMenu}
          />
        )}

        <NewFileDialog 
          isOpen={isNewFileDialogOpen} 
          onClose={() => setIsNewFileDialogOpen(false)} 
          onCreateFile={handleCreateNewFile}
        />
      </div>
    </ThemeProvider>
  );
};

export default VSCodeLayout;