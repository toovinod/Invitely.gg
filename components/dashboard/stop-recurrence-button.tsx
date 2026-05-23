"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
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

interface StopRecurrenceButtonProps {
  eventId: string;
  recurrence: string;
  futureCount: number;
}

export function StopRecurrenceButton({
  eventId,
  recurrence,
  futureCount,
}: StopRecurrenceButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [cancelFuture, setCancelFuture] = useState(false);

  async function handleStop() {
    try {
      setIsLoading(true);
      const url = cancelFuture
        ? `/api/events/${eventId}/recurring?cancelFuture=true`
        : `/api/events/${eventId}/recurring`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to stop recurrence");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm h-8 gap-1.5 border-white/8 text-muted-foreground hover:text-foreground hover:border-white/15 hover:bg-white/4 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Stop repeating
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden">
        <AlertDialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <AlertDialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Stop recurring event
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            This event repeats{" "}
            <span className="text-foreground font-medium">{recurrence}</span>.
            {futureCount > 0 && (
              <>
                {" "}
                There {futureCount === 1 ? "is" : "are"}{" "}
                <span className="font-mono text-foreground">{futureCount}</span>{" "}
                future event{futureCount === 1 ? "" : "s"} already created.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {futureCount > 0 && (
          <div className="flex flex-col gap-2 px-5 sm:px-6 py-4">
            <button
              type="button"
              onClick={() => setCancelFuture(false)}
              className={`font-sans text-sm px-3.5 py-3 border text-left transition-colors cursor-pointer ${
                !cancelFuture
                  ? "border-white/15 bg-white/4 text-foreground"
                  : "border-white/8 bg-transparent text-muted-foreground hover:border-white/15 hover:bg-white/2"
              }`}
            >
              <span className="font-medium block">
                Stop future repeats only
              </span>
              <span className="text-muted-foreground text-xs leading-relaxed">
                Keep the {futureCount} already created event
                {futureCount === 1 ? "" : "s"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCancelFuture(true)}
              className={`font-sans text-sm px-3.5 py-3 border text-left transition-colors cursor-pointer ${
                cancelFuture
                  ? "border-destructive/40 bg-destructive/10 text-foreground"
                  : "border-white/8 bg-transparent text-muted-foreground hover:border-destructive/30 hover:bg-destructive/5"
              }`}
            >
              <span className="font-medium block">
                Stop and cancel all upcoming
              </span>
              <span className="text-muted-foreground text-xs leading-relaxed">
                Cancel the {futureCount} future event
                {futureCount === 1 ? "" : "s"} too
              </span>
            </button>
          </div>
        )}

        <AlertDialogFooter className="px-5 sm:px-6 py-4 gap-2 border-t border-white/6">
          <AlertDialogCancel className="font-sans text-sm h-9 cursor-pointer mt-0 border-white/8 hover:border-white/15 hover:bg-white/4">
            Keep repeating
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleStop}
            disabled={isLoading}
            className={`font-sans text-sm h-9 cursor-pointer ${
              cancelFuture
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }`}
          >
            {isLoading ? "Stopping..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
