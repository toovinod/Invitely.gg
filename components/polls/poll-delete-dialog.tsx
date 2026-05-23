"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

interface PollDeleteDialogProps {
  pollId: string;
  pollTitle: string;
}

export function PollDeleteDialog({ pollId, pollTitle }: PollDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/polls/${pollId}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("poll deleted");
      setOpen(false);
      router.push("/polls");
      router.refresh();
    } catch {
      toast.error("failed to delete poll");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden">
        <AlertDialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <AlertDialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Delete poll
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            Permanently delete{" "}
            <span className="text-foreground font-medium">{pollTitle}</span> and
            all of its votes. Invitees will no longer be able to vote. This
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-5 sm:px-6 py-4 gap-2">
          <AlertDialogCancel className="font-sans text-sm h-9 cursor-pointer mt-0 border-white/8 hover:border-white/15 hover:bg-white/4">
            Keep poll
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="font-sans text-sm h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete poll"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
