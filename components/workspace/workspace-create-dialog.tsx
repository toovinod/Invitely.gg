"use client";
import { useCreateWorkspace } from "@/app/hooks/use-workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WorkspaceCreateDialogProps {
  currentCount: number;
}

const MAX_WORKSPACES = 5;

export function WorkspaceCreateDialog({
  currentCount,
}: WorkspaceCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { createWorkspace, isLoading } = useCreateWorkspace();

  const isAtLimit = currentCount >= MAX_WORKSPACES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const success = await createWorkspace(name.trim());
    if (success) {
      setName("");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="font-sans text-sm gap-1.5 cursor-pointer h-8"
          disabled={isAtLimit}
          title={isAtLimit ? "Maximum 5 workspaces allowed" : undefined}
        >
          <Plus className="h-3.5 w-3.5" />
          New workspace
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-sans text-base font-semibold tracking-tight">
            Create workspace
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-muted-foreground">
            Group your contacts by relationship. Up to {MAX_WORKSPACES}{" "}
            workspaces, {currentCount} used.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="workspace-name"
              className="font-sans text-sm font-medium text-foreground"
            >
              Workspace name
            </Label>
            <Input
              id="workspace-name"
              placeholder="e.g. College, Office, Family"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-sans text-sm h-10 px-3"
              maxLength={50}
              autoFocus
            />
            <p className="font-sans text-xs text-muted-foreground">
              Pick something short and memorable. You can hold up to 25 contacts
              per workspace.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-sans text-sm h-9 cursor-pointer"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-sans text-sm h-9 cursor-pointer"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? "Creating..." : "Create workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
