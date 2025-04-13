import React, { useState } from 'react';
import { 
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem, 
  MenubarSeparator, 
  MenubarShortcut 
} from '@/components/ui/menubar';
import SearchBar from './SearchBar';
import AIChatbot from './AIChatbot';

interface VSCodeMenuProps {
  onAction: (action: string) => void;
  onSectionChange: (section: string) => void;
}

const VSCodeMenu: React.FC<VSCodeMenuProps> = ({ onAction, onSectionChange }) => {
  return (
    <div className="h-9 bg-background border-b border-border flex items-center px-2 text-sm text-foreground">
      <Menubar className="border-none bg-transparent p-0 h-auto">
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 hover:bg-accent/50 data-[state=open]:bg-accent/50">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAction('newFile')}>
              New File <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('newFolder')}>
              New Folder <MenubarShortcut>⇧⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => onAction('save')}>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('saveAs')}>
              Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 hover:bg-accent/50 data-[state=open]:bg-accent/50">Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAction('undo')}>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('redo')}>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => onAction('cut')}>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('copy')}>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('paste')}>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 hover:bg-accent/50 data-[state=open]:bg-accent/50">View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAction('explorer')}>
              Explorer <MenubarShortcut>⇧⌘E</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('search')}>
              Search <MenubarShortcut>⇧⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => onAction('problems')}>
              Problems <MenubarShortcut>⇧⌘M</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 hover:bg-accent/50 data-[state=open]:bg-accent/50">Go</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAction('goToHome')}>
              Home <MenubarShortcut>⇧⌘H</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('goToAbout')}>
              About <MenubarShortcut>⇧⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => onAction('goToTimeline')}>
              Timeline
            </MenubarItem>
            <MenubarItem onClick={() => onAction('goToTracks')}>
              Tracks
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 hover:bg-accent/50 data-[state=open]:bg-accent/50">Run</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAction('run')}>
              Start Debugging <MenubarShortcut>F5</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('runWithoutDebugging')}>
              Run Without Debugging <MenubarShortcut>⌃F5</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 hover:bg-accent/50 data-[state=open]:bg-accent/50">Terminal</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAction('terminal')}>
              New Terminal <MenubarShortcut>⌃`</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('splitTerminal')}>
              Split Terminal
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2 py-1 hover:bg-accent/50 data-[state=open]:bg-accent/50">Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAction('help')}>
              FAQ <MenubarShortcut>F1</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onAction('about')}>
              About 
            </MenubarItem>
            <MenubarItem onClick={() => onAction('extensions')}>
              Get Themes & Extensions
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      
      <div className="flex-1 flex justify-center gap-2 items-center">
        <SearchBar onSectionChange={onSectionChange} />
        <AIChatbot />
      </div>
    </div>
  );
};

export default VSCodeMenu;