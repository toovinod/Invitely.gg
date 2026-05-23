"use client";
import { WorkspaceRecipientPicker } from "@/components/shared/workspace-recipient-picker";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EventCreationState,
  RecipientEntry,
} from "@/app/hooks/use-event-creation";

interface Workspace {
  id: string;
  name: string;
  members: { id: string; name: string | null; email: string }[];
}

interface StepSelectRecipientsProps {
  state: EventCreationState;
  workspaces: Workspace[];
  onToggleRecipient: (entry: RecipientEntry) => void;
  onToggleWorkspace: (members: RecipientEntry[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepSelectRecipients({
  state,
  workspaces,
  onToggleRecipient,
  onToggleWorkspace,
  onNext,
  onBack,
}: StepSelectRecipientsProps) {
  const selectedCount = state.selectedRecipients.size;

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceRecipientPicker
        workspaces={workspaces}
        selected={state.selectedRecipients}
        onToggleRecipient={onToggleRecipient}
        onToggleWorkspace={onToggleWorkspace}
      />

      <div className="flex justify-between pt-2 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          onClick={onBack}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer"
          onClick={onNext}
          disabled={selectedCount === 0}
        >
          Continue
          <span className="font-mono tabular-nums opacity-80">
            ({selectedCount})
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
