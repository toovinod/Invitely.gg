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

  // The server hands us `initialToken` on first paint and the only mutator
  // after that is the local regenerate handler — so we don't need an effect
  // to sync prop → state. Keeping local state as the source of truth keeps
  // React happy (no setState-in-effect) and avoids a redundant render.

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
      <DialogContent className="font-mono sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">
            Subscribe to your calendar
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-muted-foreground">
            Paste this URL into Google Calendar / Apple Calendar / Outlook to
            see Invitely.gg events alongside your other calendars. The feed
            updates automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Feed URL
            </span>
            <div className="flex items-stretch gap-1.5">
              <input
                readOnly
                value={feedUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 font-mono text-[11px] h-8 px-2 border border-border bg-muted/30 text-foreground focus:outline-none focus:border-foreground/40 rounded-none tabular-nums"
              />
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer shrink-0"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border border-border bg-muted/10 px-3 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              How to subscribe
            </span>
            <ol className="font-mono text-xs text-muted-foreground leading-relaxed list-decimal pl-4 flex flex-col gap-0.5">
              <li>
                <span className="text-foreground">Google Calendar:</span> Other
                calendars → + → From URL → paste
              </li>
              <li>
                <span className="text-foreground">Apple Calendar:</span> File →
                New Calendar Subscription → paste
              </li>
              <li>
                <span className="text-foreground">Outlook:</span> Add calendar →
                Subscribe from web → paste
              </li>
            </ol>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer text-muted-foreground hover:text-destructive"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCw
              className={`h-3 w-3 ${isRegenerating ? "animate-spin" : ""}`}
            />
            {isRegenerating ? "Regenerating..." : "Regenerate URL"}
          </Button>
          <a href={feedUrl} download="invitely.ics">
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer"
            >
              <Download className="h-3 w-3" />
              Download .ics
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
