
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface NewFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (fileName: string, type: string) => void;
}

const NewFileDialog: React.FC<NewFileDialogProps> = ({ isOpen, onClose, onCreateFile }) => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('component');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim()) {
      onCreateFile(fileName, fileType);
      setFileName('');
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
              <RadioGroup value={fileType} onValueChange={setFileType} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="component" id="component" />
                  <Label htmlFor="component" className="cursor-pointer">Component (.tsx)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="utility" id="utility" />
                  <Label htmlFor="utility" className="cursor-pointer">Utility (.ts)</Label>
                </div>
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
