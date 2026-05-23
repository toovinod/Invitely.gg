"use client";
import { EventCreationState, Recurrence } from "@/app/hooks/use-event-creation";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepEventDetailsProps {
  state: EventCreationState;
  setField: <K extends keyof EventCreationState>(
    key: K,
    value: EventCreationState[K],
  ) => void;
  onNext: () => void;
}

const inputClass =
  "font-sans text-sm h-10 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5";
const labelClass = "font-sans text-sm font-medium text-foreground";

export function StepEventDetails({
  state,
  setField,
  onNext,
}: StepEventDetailsProps) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  const isValid =
    state.name.trim() &&
    state.desc.trim() &&
    state.eventAt &&
    state.location.trim() &&
    new Date(state.eventAt) > new Date();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-name" className={labelClass}>
          Event name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="event-name"
          placeholder="Shambavi's Birthday Party"
          value={state.name}
          onChange={(e) => setField("name", e.target.value)}
          className={inputClass}
          maxLength={100}
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="event-desc" className={labelClass}>
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="event-desc"
          placeholder="A short description of your event..."
          value={state.desc}
          onChange={(e) => setField("desc", e.target.value)}
          className="font-sans text-sm min-h-24 resize-none px-3 py-2.5 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5"
          maxLength={1000}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="event-at" className={labelClass}>
            Date &amp; time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="event-at"
            type="datetime-local"
            value={state.eventAt}
            min={minDateTime}
            onChange={(e) => setField("eventAt", e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="event-location" className={labelClass}>
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="event-location"
            placeholder="123 MG Road or Zoom link"
            value={state.location}
            onChange={(e) => setField("location", e.target.value)}
            className={inputClass}
            maxLength={200}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="font-sans text-sm font-medium text-foreground flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          Repeat this event
        </Label>
        <Select
          value={state.recurrence ?? "none"}
          onValueChange={(val) => {
            const newRecurrence = val === "none" ? null : (val as Recurrence);
            setField("recurrence", newRecurrence);
            if (!newRecurrence) setField("autoInvite", false);
          }}
        >
          <SelectTrigger className="font-sans text-sm h-10 w-full sm:w-56 cursor-pointer border-white/8 bg-transparent hover:border-white/15">
            <SelectValue placeholder="Does not repeat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="none"
              className="font-sans text-sm cursor-pointer"
            >
              Does not repeat
            </SelectItem>
            <SelectItem
              value="weekly"
              className="font-sans text-sm cursor-pointer"
            >
              Weekly
            </SelectItem>
            <SelectItem
              value="monthly"
              className="font-sans text-sm cursor-pointer"
            >
              Monthly
            </SelectItem>
            <SelectItem
              value="annually"
              className="font-sans text-sm cursor-pointer"
            >
              Annually
            </SelectItem>
          </SelectContent>
        </Select>

        {state.recurrence && (
          <div className="flex flex-col gap-3">
            <p className="font-sans text-sm text-muted-foreground">
              A new event will be created automatically every{" "}
              <span className="text-foreground font-medium">
                {state.recurrence}
              </span>{" "}
              after this one ends.
            </p>
            <div className="flex items-start gap-3 border border-white/8 bg-white/2 px-4 py-3">
              <Checkbox
                id="auto-invite"
                checked={state.autoInvite}
                onCheckedChange={(checked) =>
                  setField("autoInvite", checked === true)
                }
                className="mt-0.5 cursor-pointer"
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="auto-invite"
                  className="font-sans text-sm text-foreground font-medium cursor-pointer"
                >
                  Automatically invite the same guests each time
                </label>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  When the next occurrence is created, invitations are sent to
                  the same guest list automatically. Leave unchecked to select
                  guests manually each time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer"
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </form>
  );
}
