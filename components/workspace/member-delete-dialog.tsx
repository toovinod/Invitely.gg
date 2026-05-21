"use client";

import { useDeleteMember } from "@/app/hooks/use-workspaces";
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
import { X } from "lucide-react";

interface MemberDeleteDialogProps {
  memberId: string;
  memberEmail: string;
  workspaceId: string;
}

export function MemberDeleteDialog({
  memberId,
  memberEmail,
  workspaceId,
}: MemberDeleteDialogProps) {
  const { deleteMember, isLoading } = useDeleteMember();

  async function handleDelete() {
    await deleteMember(memberId, workspaceId);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          aria-label={`Remove ${memberEmail}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden border-white/8 bg-[#0a0a0a]">
        <AlertDialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <AlertDialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Remove member
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            Remove{" "}
            <span className="font-mono text-foreground">{memberEmail}</span>{" "}
            from this workspace? You can always add them back later.
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
            {isLoading ? "Removing..." : "Remove member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
