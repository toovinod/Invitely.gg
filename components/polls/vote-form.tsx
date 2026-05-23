"use client";

import { CheckCircle2, Send } from "lucide-react";
import { PollPublicView } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col items-center justify-center py-16 sm:py-20 px-6 gap-4 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="relative shrink-0 rounded-full border border-white/8 bg-white/4 w-12 h-12 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="relative flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-sans text-base font-medium text-foreground">
            {view.status === "finalized" ? "Poll finalised" : "Voting closed"}
          </h3>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            {view.organizerName} will be in touch with the chosen slot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
        <div className="border-b border-white/6 px-4 sm:px-5 py-3">
          <Label
            htmlFor="voter-name"
            className="font-sans text-sm font-medium text-foreground"
          >
            Your name{" "}
            <span className="text-muted-foreground/70 font-normal">
              (optional)
            </span>
          </Label>
        </div>
        <div className="px-4 sm:px-5 py-4">
          <Input
            id="voter-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="So the host knows it's you"
            className="font-sans text-sm h-10 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5"
            maxLength={100}
          />
        </div>
      </div>

      <section className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
            Pick what works
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {selected.size} selected
          </span>
          <div className="h-px flex-1 bg-white/6" />
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
                className={`group flex items-center justify-between gap-3 px-4 py-3 border text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-foreground/40 bg-white/4"
                    : "border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/4"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`h-4 w-4 shrink-0 border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-foreground bg-foreground"
                        : "border-white/15 bg-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <CheckCircle2 className="h-3 w-3 text-background" />
                    )}
                  </span>
                  <span className="font-sans text-sm text-foreground">
                    {formatSlot(option.startAt)}
                  </span>
                </div>
                {isSelected && (
                  <span className="inline-flex items-center border border-white/15 bg-white/6 px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide text-foreground">
                    Yes
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
        className="font-sans text-sm h-10 gap-1.5 cursor-pointer"
      >
        <Send className="h-3.5 w-3.5" />
        {isSubmitting
          ? "Saving..."
          : submitted
            ? "Update my votes"
            : "Submit my votes"}
      </Button>

      {submitted && (
        <p className="font-sans text-xs text-muted-foreground text-center">
          Thanks you can change your votes any time before the poll closes.
        </p>
      )}
    </form>
  );
}
