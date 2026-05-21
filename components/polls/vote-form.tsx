"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Send } from "lucide-react";
import { PollPublicView } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

interface VoteFormProps {
  token: string;
  view: PollPublicView;
}

interface ApiEnvelope {
  success: boolean;
  message: string;
  data?: { votedOptionCount: number };
}

function formatSlot(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * The public voting form. Users tick the slots that work for them and submit
 * — the server replaces their vote set on every submit, so editing a vote
 * after submission Just Works.
 */
export function VoteForm({ token, view }: VoteFormProps) {
  const [name, setName] = useState(view.invitee.name ?? "");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(view.votedOptionIds),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(view.invitee.respondedAt !== null);

  const isClosed =
    view.status !== "open" ||
    (view.closesAt !== null && new Date(view.closesAt) < new Date());

  function toggle(optionId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) next.delete(optionId);
      else next.add(optionId);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isClosed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/polls/token/${token}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionIds: Array.from(selected),
          name: name.trim() || null,
        }),
      });
      const json = (await res.json()) as ApiEnvelope;
      if (!json.success) {
        toast.error(json.message);
        return;
      }
      setSubmitted(true);
      toast.success("votes saved — thanks!");
    } catch {
      toast.error("failed to save votes");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isClosed) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
          <p className="font-mono text-sm text-foreground">
            {view.status === "finalized"
              ? "This poll has been finalised."
              : "Voting is closed for this poll."}
          </p>
          <p className="font-mono text-xs text-muted-foreground max-w-sm">
            {view.organizerName} will be in touch with the chosen slot.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader className="border-b">
          <Label htmlFor="voter-name" className="font-mono text-xs">
            Your name (optional)
          </Label>
        </CardHeader>
        <CardContent className="pt-4">
          <Input
            id="voter-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="So the host knows it's you"
            className="font-mono text-sm h-9"
            maxLength={100}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Pick the slots that work — {selected.size} selected
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {view.options.map((option) => {
            const isSelected = selected.has(option.id);
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => toggle(option.id)}
                aria-pressed={isSelected}
                className={`flex items-center justify-between gap-3 px-4 py-3 border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "border-foreground bg-foreground/5"
                    : "border-border bg-card hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`h-4 w-4 shrink-0 border ${
                      isSelected
                        ? "border-foreground bg-foreground"
                        : "border-border bg-background"
                    } flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <CheckCircle2 className="h-3 w-3 text-background" />
                    )}
                  </span>
                  <span className="font-mono text-sm text-foreground tabular-nums">
                    {formatSlot(option.startAt)}
                  </span>
                </div>
                {isSelected && (
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] border-foreground/30 bg-foreground/10"
                  >
                    Yes
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
        className="font-mono text-xs h-10 gap-2 rounded-none cursor-pointer"
      >
        <Send className="h-3 w-3" />
        {isSubmitting
          ? "Saving..."
          : submitted
            ? "Update my votes"
            : "Submit my votes"}
      </Button>

      {submitted && (
        <p className="font-mono text-[10px] text-muted-foreground text-center">
          Thanks — you can change your votes any time before the poll closes.
        </p>
      )}
    </form>
  );
}
