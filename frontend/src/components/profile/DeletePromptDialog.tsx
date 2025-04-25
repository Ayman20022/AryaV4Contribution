import React from 'react';
import { Prompt } from '@/data/dummyPrompts'; // Adjust path
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeletePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptToDelete: Prompt | null;
  onConfirmDelete: () => void;
}

const DeletePromptDialog: React.FC<DeletePromptDialogProps> = ({
  open,
  onOpenChange,
  promptToDelete,
  onConfirmDelete,
}) => {
  if (!promptToDelete) return null; // Don't render if no prompt is selected

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Prompt</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{promptToDelete.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirmDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePromptDialog;