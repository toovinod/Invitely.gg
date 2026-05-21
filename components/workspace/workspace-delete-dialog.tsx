"use client";
import { useDeleteWorkspace } from "@/app/hooks/use-workspaces";
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

interface WorkspaceDeleteDialogProps {
  workspaceId: string;
  workspaceName: string;
}

export function WorkspaceDeleteDialog({
  workspaceId,
  workspaceName,
}: WorkspaceDeleteDialogProps) {
  const { deleteWorkspace, isLoading } = useDeleteWorkspace();

  async function handleDelete() {
    await deleteWorkspace(workspaceId);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          aria-label={`Delete workspace ${workspaceName}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden">
        <AlertDialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <AlertDialogTitle className="font-sans text-base font-semibold tracking-tight">
            Delete workspace
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            This will permanently delete{" "}
            <span className="text-foreground font-medium">{workspaceName}</span>{" "}
            and all of its members. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="px-6 py-4 gap-2">
          <AlertDialogCancel className="font-sans text-sm h-9 cursor-pointer mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="font-sans text-sm h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Delete workspace"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
