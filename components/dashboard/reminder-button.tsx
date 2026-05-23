"use client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReminderButtonProps {
  eventId: string;
  pendingCount: number;
}

export function ReminderButton({ eventId, pendingCount }: ReminderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (pendingCount === 0) return null;

  async function handleReminder() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/reminder`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
    } catch {
      toast.error("Failed to send reminders");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-sans text-sm gap-1.5 h-8 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
      onClick={handleReminder}
      disabled={isLoading}
    >
      <Send className="h-3.5 w-3.5" />
      {isLoading ? "Sending..." : `Remind ${pendingCount} pending`}
    </Button>
  );
}
