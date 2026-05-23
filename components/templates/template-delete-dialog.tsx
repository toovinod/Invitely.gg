"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TemplateDeleteDialogProps {
  templateId: string;
  templateName: string;
  onDeleted: () => void;
}

export function TemplateDeleteDialog({
  templateId,
  templateName,
  onDeleted,
}: TemplateDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("template deleted");
      onDeleted();
    } catch {
      toast.error("failed to delete template");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          aria-label={`Delete template ${templateName}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden">
        <AlertDialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <AlertDialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Delete template
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            This will permanently delete{" "}
            <span className="text-foreground font-medium">{templateName}</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="px-5 sm:px-6 py-4 gap-2">
          <AlertDialogCancel className="font-sans text-sm h-9 cursor-pointer mt-0 border-white/8 hover:border-white/15 hover:bg-white/4">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="font-sans text-sm h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Delete template"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
