"use client";
import { EventCreationState } from "@/app/hooks/use-event-creation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Send,
  Users,
  Sparkles,
  Clock,
  ArrowLeft,
  Check,
  HelpCircle,
  X as XIcon,
} from "lucide-react";

interface SmartSendSuggestion {
  suggestedAt: string;
  dayLabel: string;
  timeLabel: string;
  reason: string;
}

interface StepPreviewSendProps {
  state: EventCreationState;
  organizerName: string;
  organizerEmail: string;
  onBack: () => void;
  onSend: () => Promise<void>;
  onSchedule: (scheduledAt: string) => Promise<void>;
}

export function StepPreviewSend({
  state,
  organizerName,
  organizerEmail,
  onBack,
  onSend,
  onSchedule,
}: StepPreviewSendProps) {
  const selectedCount = state.selectedRecipients.size;
  const [suggestion, setSuggestion] = useState<SmartSendSuggestion | null>(
    null,
  );
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const formattedDate = state.eventAt
    ? new Date(state.eventAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  async function handleGetSuggestion() {
    try {
      setIsLoadingSuggestion(true);
      const res = await fetch("/api/ai/smart-send-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: state.name,
          eventDate: formattedDate,
          eventLocation: state.location,
          eventDesc: state.desc,
        }),
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setSuggestion(result.data);
    } catch {
      toast.error("Failed to get suggestion");
    } finally {
      setIsLoadingSuggestion(false);
    }
  }

  async function handleSchedule() {
    if (!suggestion) return;
    try {
      setIsScheduling(true);
      await onSchedule(suggestion.suggestedAt);
    } finally {
      setIsScheduling(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-white/8 bg-white/2 overflow-hidden">
        <div className="border-b border-white/6 px-4 sm:px-5 py-3 bg-transparent">
          <div className="grid grid-cols-[60px_1fr] gap-x-3 gap-y-1.5">
            <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider">
              From
            </span>
            <span className="font-mono text-xs text-foreground truncate">
              {organizerEmail || "Invitely.gg <noreply@invitely.gg>"}
            </span>
            <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider">
              Subject
            </span>
            <span className="font-sans text-sm text-foreground truncate">
              {state.emailSubject || "—"}
            </span>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-5 flex flex-col gap-5">
          <div className="border-l-2 border-white/15 pl-3 flex flex-col gap-0.5">
            <p className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider">
              Invited by
            </p>
            <p className="font-sans text-sm font-medium text-foreground">
              {organizerName}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-sans text-xl font-semibold tracking-tight text-foreground">
              {state.name}
            </h3>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span className="font-sans text-xs text-muted-foreground">
                  {state.location}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/6" />

          <div className="font-sans text-sm text-foreground/90 leading-relaxed">
            {state.emailBody
              ? state.emailBody.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))
              : "—"}
          </div>

          <div className="h-px bg-white/6" />

          <div className="flex flex-col gap-2">
            <p className="font-sans text-xs text-muted-foreground">
              Will you be attending?
            </p>
            <div className="flex gap-2 flex-wrap">
              {[
                {
                  label: "Attending",
                  Icon: Check,
                  className: "border-white/15 bg-white/6 text-foreground",
                },
                {
                  label: "Maybe",
                  Icon: HelpCircle,
                  className: "border-white/8 bg-white/3 text-muted-foreground",
                },
                {
                  label: "Can't make it",
                  Icon: XIcon,
                  className:
                    "border-destructive/30 bg-destructive/10 text-destructive",
                },
              ].map(({ label, Icon, className }) => (
                <div
                  key={label}
                  className={`font-sans text-xs px-3 py-1.5 border inline-flex items-center gap-1.5 ${className}`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border border-white/8 bg-white/2 px-4 py-3">
        <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-sans text-sm text-muted-foreground">
          Sending to
        </span>
        <span className="inline-flex items-center gap-1 border border-white/15 bg-white/6 px-2 h-6 font-mono text-xs tabular-nums text-foreground">
          {selectedCount} recipient{selectedCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="relative overflow-hidden border border-white/8 bg-white/2 p-4 sm:p-5 flex flex-col gap-3.5">
        <div className="relative flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="font-sans text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Smart send time
            </p>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Let AI suggest the best time to send for maximum opens.
            </p>
          </div>
          {!suggestion && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-sans text-sm gap-1.5 h-8 shrink-0 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
              onClick={handleGetSuggestion}
              disabled={isLoadingSuggestion}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isLoadingSuggestion ? "Thinking..." : "Suggest time"}
            </Button>
          )}
        </div>

        {suggestion && (
          <div className="relative flex flex-col gap-3">
            <div className="border border-white/15 bg-white/4 px-3.5 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-foreground" />
                <span className="font-sans text-sm font-semibold text-foreground">
                  {suggestion.dayLabel} at{" "}
                  <span className="font-mono">{suggestion.timeLabel}</span>
                </span>
              </div>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                {suggestion.reason}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-sans text-sm gap-1.5 h-8 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
                onClick={handleSchedule}
                disabled={isScheduling || state.isSending}
              >
                <Clock className="h-3.5 w-3.5" />
                {isScheduling
                  ? "Scheduling..."
                  : `Schedule for ${suggestion.dayLabel}`}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="font-sans text-sm h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
                onClick={handleGetSuggestion}
                disabled={isLoadingSuggestion}
              >
                {isLoadingSuggestion ? "Thinking..." : "New suggestion"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2 gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          onClick={onBack}
          disabled={state.isSending || isScheduling}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer"
          onClick={onSend}
          disabled={state.isSending || isScheduling || selectedCount === 0}
        >
          <Send className="h-3.5 w-3.5" />
          {state.isSending
            ? "Sending..."
            : `Send now to ${selectedCount} guest${selectedCount === 1 ? "" : "s"}`}
        </Button>
      </div>
    </div>
  );
}
