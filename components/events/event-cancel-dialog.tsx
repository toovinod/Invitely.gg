"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
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
import { useState } from "react";
import { toast } from "sonner";

interface EventCancelDialogProps {
  eventId: string;
  eventName: string;
  guestCount: number;
}

export function EventCancelDialog({
  eventId,
  eventName,
  guestCount,
}: EventCancelDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCancel() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch {
      toast.error("Failed to cancel event");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer font-sans text-sm h-8 gap-1.5 border-white/8 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10"
        >
          <XCircle className="h-3.5 w-3.5" />
          Cancel event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden">
        <AlertDialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <AlertDialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Cancel event
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            This will cancel{" "}
            <span className="text-foreground font-medium">{eventName}</span>
            {guestCount > 0 && (
              <>
                {" "}
                and notify{" "}
                <span className="text-foreground font-medium">
                  {guestCount} guest{guestCount === 1 ? "" : "s"}
                </span>{" "}
                by email
              </>
            )}
            . This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-5 sm:px-6 py-4 gap-2">
          <AlertDialogCancel className="font-sans text-sm h-9 cursor-pointer mt-0 border-white/8 hover:border-white/15 hover:bg-white/4">
            Keep event
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="font-sans text-sm h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isLoading ? "Cancelling..." : "Cancel event"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
