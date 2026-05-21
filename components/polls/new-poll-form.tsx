"use client";

import {
  RecipientEntry,
  WorkspaceRecipientPicker,
} from "@/components/shared/workspace-recipient-picker";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { POLL_LIMITS } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface OptionDraft {
  id: string;
  startAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface CreateResponse {
  poll: { id: string };
}

interface WorkspaceLite {
  id: string;
  name: string;
  members: { id: string; name: string | null; email: string }[];
}

interface NewPollFormProps {
  workspaces: WorkspaceLite[];
}

function blankOption(): OptionDraft {
  return {
    id: globalThis.crypto.randomUUID(),
    startAt: "",
  };
}

const HOUR_MS = 60 * 60 * 1000;

export function NewPollForm({ workspaces }: NewPollFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>([
    blankOption(),
    blankOption(),
  ]);
  const [selected, setSelected] = useState<Map<string, RecipientEntry>>(
    () => new Map(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [minDateTime] = useState<string>(() => {
    const d = new Date(
      Date.now() + POLL_LIMITS.MIN_FIRST_SLOT_HOURS_AHEAD * HOUR_MS,
    );
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

  const filledOptions = options.filter((o) => o.startAt);
  const hasEnoughSlots = filledOptions.length >= POLL_LIMITS.MIN_OPTIONS;
  const hasSelection = selected.size > 0;
  const isValid = title.trim().length > 0 && hasEnoughSlots && hasSelection;

  const projectedCloseLabel = useMemo(() => {
    if (filledOptions.length === 0) return null;
    const earliest = filledOptions
      .map((o) => new Date(o.startAt).getTime())
      .filter((t) => !Number.isNaN(t))
      .sort((a, b) => a - b)[0];
    if (!earliest) return null;
    const close = new Date(
      earliest - POLL_LIMITS.AUTO_CLOSE_HOURS_BEFORE_FIRST_SLOT * HOUR_MS,
    );
    return close.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [filledOptions]);

  function setOption(id: string, startAt: string) {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, startAt } : o)),
    );
  }

  function addOption() {
    if (options.length >= POLL_LIMITS.MAX_OPTIONS) return;
    setOptions((prev) => [...prev, blankOption()]);
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  function toggleRecipient(entry: RecipientEntry) {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(entry.email)) next.delete(entry.email);
      else next.set(entry.email, entry);
      return next;
    });
  }

  function toggleWorkspace(members: RecipientEntry[]) {
    setSelected((prev) => {
      const next = new Map(prev);
      const allIn = members.every((m) => next.has(m.email));
      if (allIn) {
        members.forEach((m) => next.delete(m.email));
      } else {
        members.forEach((m) => next.set(m.email, m));
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    if (selected.size > POLL_LIMITS.MAX_INVITEES) {
      toast.error(`Pick at most ${POLL_LIMITS.MAX_INVITEES} invitees`);
      return;
    }

    setIsSubmitting(true);
    try {
      const invitees = Array.from(selected.values()).map((entry) => ({
        email: entry.email.trim().toLowerCase(),
        name: entry.name?.trim() || null,
      }));

      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          location: location.trim() || null,
          closesAt: null,
          options: filledOptions.map((o) => ({
            startAt: new Date(o.startAt).toISOString(),
            endAt: null,
          })),
          invitees,
        }),
      });
      const json = (await res.json()) as ApiEnvelope<CreateResponse>;
      if (!json.success || !json.data) {
        toast.error(json.message);
        return;
      }
      toast.success("poll created and emails sent");
      router.push(`/polls/${json.data.poll.id}`);
    } catch {
      toast.error("failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="poll-title" className="font-mono text-xs">
            Poll title *
          </Label>
          <Input
            id="poll-title"
            placeholder="Q4 team dinner"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-mono text-sm h-9"
            maxLength={150}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="poll-desc" className="font-mono text-xs">
            Context (optional)
          </Label>
          <Textarea
            id="poll-desc"
            placeholder="A short message your invitees will see when they vote"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="font-mono text-sm min-h-20 resize-none"
            maxLength={1000}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="poll-location" className="font-mono text-xs">
            Location (optional)
          </Label>
          <Input
            id="poll-location"
            placeholder="The Wine Bar, downtown"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="font-mono text-sm h-9"
            maxLength={200}
          />
        </div>
      </section>

      <Separator className="bg-border" />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label className="font-mono text-xs">
            Time slots * ({filledOptions.length}/{POLL_LIMITS.MAX_OPTIONS})
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            disabled={options.length >= POLL_LIMITS.MAX_OPTIONS}
            className="font-mono text-xs h-7 gap-1.5 rounded-none cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            Add slot
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {options.map((option, idx) => (
            <div
              key={option.id}
              className="flex items-center gap-2 border border-border bg-card px-3 py-2"
            >
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums w-5 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <Input
                type="datetime-local"
                value={option.startAt}
                min={minDateTime}
                onChange={(e) => setOption(option.id, e.target.value)}
                className="font-mono text-sm h-8 flex-1"
                required
              />
              {options.length > POLL_LIMITS.MIN_OPTIONS && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(option.id)}
                  className="h-7 w-7 rounded-none cursor-pointer text-muted-foreground hover:text-destructive"
                  aria-label="Remove slot"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">
          Voting auto-closes {POLL_LIMITS.AUTO_CLOSE_HOURS_BEFORE_FIRST_SLOT}h
          before your first slot
          {projectedCloseLabel ? ` — ${projectedCloseLabel}.` : "."}
        </p>
      </section>

      <Separator className="bg-border" />

      <section className="flex flex-col gap-3">
        <Label className="font-mono text-xs">
          Invitees * ({selected.size}/{POLL_LIMITS.MAX_INVITEES})
        </Label>
        <WorkspaceRecipientPicker
          workspaces={workspaces}
          selected={selected}
          onToggleRecipient={toggleRecipient}
          onToggleWorkspace={toggleWorkspace}
          showSelectionBadge={false}
        />
      </section>

      <Separator className="bg-border" />

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/polls")}
          className="font-mono text-xs h-9 rounded-none cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!isValid || isSubmitting}
          className="font-mono text-xs h-9 rounded-none cursor-pointer"
        >
          {isSubmitting
            ? "Sending..."
            : `Create poll & send (${selected.size})`}
        </Button>
      </div>
    </form>
  );
}
