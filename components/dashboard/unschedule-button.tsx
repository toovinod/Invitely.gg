"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CalendarX } from "lucide-react";
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

interface UnscheduleButtonProps {
  eventId: string;
  scheduledAt: Date;
}

export function UnscheduleButton({
  eventId,
  scheduledAt,
}: UnscheduleButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formattedSchedule = new Date(scheduledAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleUnschedule() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/schedule`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("Scheduled send cancelled");
      router.refresh();
    } catch {
      toast.error("Failed to cancel scheduled send");
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
          className="cursor-pointer font-sans text-sm h-8 gap-1.5 border-white/8 text-muted-foreground hover:text-foreground hover:border-white/15 hover:bg-white/4"
        >
          <CalendarX className="h-3.5 w-3.5" />
          Unschedule
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden">
        <AlertDialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <AlertDialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Cancel scheduled send
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            This will cancel the send scheduled for{" "}
            <span className="font-mono text-foreground">
              {formattedSchedule}
            </span>
            . All pending invitations will be removed. You can still send
            manually anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-5 sm:px-6 py-4 gap-2">
          <AlertDialogCancel className="font-sans text-sm h-9 cursor-pointer mt-0 border-white/8 hover:border-white/15 hover:bg-white/4">
            Keep schedule
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnschedule}
            disabled={isLoading}
            className="cursor-pointer font-sans text-sm h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Cancelling..." : "Cancel schedule"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
