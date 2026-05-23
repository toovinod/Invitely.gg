"use client";

import { StepSelectRecipients } from "@/components/events/new/step-select-recipients";
import { StepEventDetails } from "@/components/events/new/step-event-details";
import { StepWriteInvite } from "@/components/events/new/step-write-invite";
import { StepPreviewSend } from "@/components/events/new/step-preview-send";
import { EventStepper } from "@/components/events/new/event-stepper";
import { useEventCreation } from "@/app/hooks/use-event-creation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string | null;
  email: string;
}

interface Workspace {
  id: string;
  name: string;
  members: Member[];
}

interface NewEventFormProps {
  workspaces: Workspace[];
  organizerName: string;
  organizerEmail: string;
}

const stepTitles: Record<number, string> = {
  1: "Event details",
  2: "Write invite",
  3: "Select recipients",
  4: "Preview & send",
};

const stepHints: Record<number, string> = {
  1: "When, where, and how often.",
  2: "Compose the message your guests will receive.",
  3: "Choose who gets invited from your workspaces.",
  4: "Review everything before sending — or schedule a smart send.",
};

export function NewEventForm({
  workspaces,
  organizerName,
  organizerEmail,
}: NewEventFormProps) {
  const router = useRouter();
  const {
    state,
    setField,
    nextStep,
    prevStep,
    toggleRecipient,
    toggleWorkspace,
    polishWithAI,
    submitEvent,
    scheduleEvent,
  } = useEventCreation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
        <EventStepper currentStep={state.currentStep} />
        <Button
          variant="ghost"
          size="sm"
          className="font-sans text-sm h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 shrink-0 cursor-pointer"
          onClick={() => router.push("/events")}
          disabled={state.isSending}
        >
          Cancel
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
          Step {state.currentStep} of 4
        </p>
        <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">
          {stepTitles[state.currentStep]}
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          {stepHints[state.currentStep]}
        </p>
      </div>

      {state.currentStep === 1 && (
        <StepEventDetails state={state} setField={setField} onNext={nextStep} />
      )}

      {state.currentStep === 2 && (
        <StepWriteInvite
          state={state}
          setField={setField}
          onNext={nextStep}
          onBack={prevStep}
          onPolish={polishWithAI}
        />
      )}

      {state.currentStep === 3 && (
        <StepSelectRecipients
          state={state}
          workspaces={workspaces}
          onToggleRecipient={toggleRecipient}
          onToggleWorkspace={toggleWorkspace}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}

      {state.currentStep === 4 && (
        <StepPreviewSend
          state={state}
          organizerName={organizerName}
          organizerEmail={organizerEmail}
          onBack={prevStep}
          onSend={submitEvent}
          onSchedule={scheduleEvent}
        />
      )}
    </div>
  );
}
