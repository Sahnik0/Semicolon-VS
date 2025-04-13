import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from '@/components/ui/command';

interface SearchBarProps {
  onSectionChange: (section: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSectionChange }) => {
  const [open, setOpen] = useState(false);
  
  const sections = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'timeline', name: 'Timeline' },
    { id: 'tracks', name: 'Tracks' },
    { id: 'judges', name: 'Judges' },
    { id: 'team', name: 'Team' },
    { id: 'faq', name: 'FAQ' },
    { id: 'sponsors', name: 'Sponsors' },
  ];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (sectionId: string) => {
    onSectionChange(sectionId);
    setOpen(false);
  };

  return (
    <>
      <div 
        className="flex items-center h-8 px-2 bg-accent/50 rounded cursor-pointer max-w-[200px] lg:max-w-xs w-full mx-2"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Search"
      >
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <span className="text-xs text-muted-foreground">Search (Ctrl+K)</span>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search sections..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Sections">
            {sections.map((section) => (
              <CommandItem 
                key={section.id} 
                onSelect={() => handleSelect(section.id)}
              >
                {section.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
