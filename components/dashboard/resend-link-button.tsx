"use client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ResendLinkButtonProps {
  eventId: string;
  email: string;
}

export function ResendLinkButton({ eventId, email }: ResendLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleResend() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/resend-link`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
    } catch {
      toast.error("Failed to resend link");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
      onClick={handleResend}
      disabled={isLoading}
      title="Resend invitation link"
      aria-label="Resend invitation link"
    >
      <Send className="h-3.5 w-3.5" />
    </Button>
  );
}
