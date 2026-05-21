"use client";
import { WorkspaceRecipientPicker } from "@/components/shared/workspace-recipient-picker";
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

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs cursor-pointer"
          onClick={onBack}
        >
          ← Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-mono text-xs cursor-pointer"
          onClick={onNext}
          disabled={selectedCount === 0}
        >
          Next → ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
