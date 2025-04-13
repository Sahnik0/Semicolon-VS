
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (fileName: string, type: string) => void;
}

const NewFileDialog: React.FC<NewFileDialogProps> = ({ isOpen, onClose, onCreateFile }) => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('component');
  const [customExtension, setCustomExtension] = useState('');
  const [selectedOption, setSelectedOption] = useState('preset');

  const presetExtensions = {
    component: '.tsx',
    utility: '.ts',
    stylesheet: '.css',
    json: '.json',
    html: '.html',
    markdown: '.md',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim()) {
      // Create file with either preset type or custom extension
      const fileExtension = selectedOption === 'preset' 
        ? fileType
        : customExtension.startsWith('.') ? customExtension.substring(1) : customExtension;
      
      onCreateFile(fileName, fileExtension);
      setFileName('');
      setCustomExtension('');
      setSelectedOption('preset');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-[#252526] dark:text-[#cccccc] dark:border-[#3c3c3c]">
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="dark:bg-[#3c3c3c] dark:border-[#3c3c3c] dark:text-[#cccccc]"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label>File Type</Label>
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preset" id="preset" />
                  <Label htmlFor="preset" className="cursor-pointer">Preset File Type</Label>
                </div>
                
                {selectedOption === 'preset' && (
                  <Select value={fileType} onValueChange={setFileType}>
                    <SelectTrigger className="ml-6 dark:bg-[#3c3c3c] dark:border-[#3c3c3c]">
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="component">React Component (.tsx)</SelectItem>
                      <SelectItem value="utility">TypeScript Utility (.ts)</SelectItem>
                      <SelectItem value="stylesheet">CSS Style (.css)</SelectItem>
                      <SelectItem value="json">JSON (.json)</SelectItem>
                      <SelectItem value="html">HTML (.html)</SelectItem>
                      <SelectItem value="markdown">Markdown (.md)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom Extension</Label>
                </div>
                
                {selectedOption === 'custom' && (
                  <Input
                    value={customExtension}
                    onChange={(e) => setCustomExtension(e.target.value)}
                    placeholder=".js, .py, etc."
                    className="ml-6 dark:bg-[#3c3c3c] dark:border-[#3c3c3c]"
                  />
                )}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="default">Create</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFileDialog;