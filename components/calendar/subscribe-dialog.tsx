"use client";

import { Check, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appUrl: string;
  initialToken: string;
}

interface FeedResponse {
  success: boolean;
  message: string;
  data?: { token: string };
}

export function SubscribeDialog({
  open,
  onOpenChange,
  appUrl,
  initialToken,
}: SubscribeDialogProps) {
  const [token, setToken] = useState(initialToken);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const feedUrl = `${appUrl}/api/calendar/feed/${token}.ics`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("failed to copy");
    }
  }

  async function handleRegenerate() {
    try {
      setIsRegenerating(true);
      const res = await fetch("/api/calendar/feed", { method: "PUT" });
      const json = (await res.json()) as FeedResponse;
      if (!json.success || !json.data) {
        toast.error(json.message);
        return;
      }
      setToken(json.data.token);
      toast.success("feed url regenerated");
    } catch {
      toast.error("failed to regenerate");
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <DialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Subscribe to your calendar
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-muted-foreground">
            Paste this URL into Google Calendar, Apple Calendar, or Outlook to
            see Invitely.gg events alongside your other calendars. The feed
            updates automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 sm:px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Feed URL
            </span>
            <div className="flex items-stretch gap-1.5">
              <input
                readOnly
                value={feedUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 font-mono text-xs h-9 px-3 border border-white/8 bg-white/2 text-foreground focus:outline-none focus:border-white/20 tabular-nums"
              />
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-sm h-9 gap-1.5 cursor-pointer shrink-0 border-white/8 hover:border-white/15 hover:bg-white/4"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border border-white/8 bg-white/2 px-3 py-2.5">
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
              How to subscribe
            </span>
            <ol className="font-sans text-xs text-muted-foreground leading-relaxed list-decimal pl-4 flex flex-col gap-1">
              <li>
                <span className="text-foreground font-medium">
                  Google Calendar:
                </span>{" "}
                Other calendars → + → From URL → paste
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Apple Calendar:
                </span>{" "}
                File → New Calendar Subscription → paste
              </li>
              <li>
                <span className="text-foreground font-medium">Outlook:</span>{" "}
                Add calendar → Subscribe from web → paste
              </li>
            </ol>
          </div>
        </div>

        <DialogFooter className="px-5 sm:px-6 py-4 gap-2 flex-row justify-between sm:justify-between border-t border-white/6">
          <Button
            variant="ghost"
            size="sm"
            className="font-sans text-sm h-9 gap-1.5 cursor-pointer text-muted-foreground hover:text-destructive"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`}
            />
            {isRegenerating ? "Regenerating..." : "Regenerate URL"}
          </Button>
          <a href={feedUrl} download="invitely.ics">
            <Button
              variant="outline"
              size="sm"
              className="font-sans text-sm h-9 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
            >
              <Download className="h-3.5 w-3.5" />
              Download .ics
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
