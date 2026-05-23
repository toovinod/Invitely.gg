"use client";
import { Users, Send, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

interface RecipientEntry {
  email: string;
  name: string | null;
}

interface SendInvitationsFormProps {
  eventId: string;
  workspaces: Workspace[];
  organizerName: string;
  organizerEmail: string;
  event: {
    name: string;
    eventAt: Date;
    location: string;
    emailSubject: string;
    emailBody: string;
  };
}

export function SendInvitationsForm({
  eventId,
  workspaces,
}: SendInvitationsFormProps) {
  const router = useRouter();
  const [selectedRecipients, setSelectedRecipients] = useState<
    Map<string, RecipientEntry>
  >(new Map());
  const [isSending, setIsSending] = useState(false);

  const allMembers = workspaces.flatMap((w) => w.members);
  const selectedCount = selectedRecipients.size;

  function toggleRecipient(member: Member) {
    setSelectedRecipients((prev) => {
      const map = new Map(prev);
      if (map.has(member.email)) {
        map.delete(member.email);
      } else {
        map.set(member.email, { email: member.email, name: member.name });
      }
      return map;
    });
  }

  function toggleWorkspace(members: Member[]) {
    setSelectedRecipients((prev) => {
      const map = new Map(prev);
      const allSelected = members.every((m) => map.has(m.email));
      if (allSelected) {
        members.forEach((m) => map.delete(m.email));
      } else {
        members.forEach((m) =>
          map.set(m.email, { email: m.email, name: m.name }),
        );
      }
      return map;
    });
  }

  function selectAll() {
    setSelectedRecipients(
      new Map(
        allMembers.map((m) => [m.email, { email: m.email, name: m.name }]),
      ),
    );
  }

  function clearAll() {
    setSelectedRecipients(new Map());
  }

  async function handleSend() {
    if (selectedRecipients.size === 0) {
      toast.error("Select at least one recipient");
      return;
    }
    try {
      setIsSending(true);
      const recipients = Array.from(selectedRecipients.values());
      const res = await fetch(`/api/events/${eventId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients }),
      });
      const data = await res.json();
      if (!data.success && res.status !== 207) {
        toast.error(data.message);
        return;
      }
      if (res.status === 207) {
        toast.warning(data.message);
      } else {
        toast.success(`Invitations sent to ${data.sent} guests`);
      }
      router.push(`/events/${eventId}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-3">
        <p className="font-sans text-sm text-muted-foreground">
          {selectedCount === 0 ? (
            "No guests selected"
          ) : (
            <>
              <span className="font-mono tabular-nums text-foreground">
                {selectedCount}
              </span>{" "}
              guest{selectedCount === 1 ? "" : "s"} selected
            </>
          )}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="font-sans text-sm h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
            onClick={selectAll}
            disabled={isSending}
          >
            Select all
          </Button>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="font-sans text-sm h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
              onClick={clearAll}
              disabled={isSending}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {workspaces.map((workspace) => {
          const allSelected = workspace.members.every((m) =>
            selectedRecipients.has(m.email),
          );
          const someSelected =
            !allSelected &&
            workspace.members.some((m) => selectedRecipients.has(m.email));
          const selectedHere = workspace.members.filter((m) =>
            selectedRecipients.has(m.email),
          ).length;

          return (
            <div key={workspace.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-sans text-sm font-medium text-foreground truncate">
                    {workspace.name}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                    {workspace.members.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-sans text-xs h-7 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
                  onClick={() => toggleWorkspace(workspace.members)}
                  disabled={isSending}
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </Button>
              </div>

              <div className="border border-white/8 bg-white/2 divide-y divide-white/6 overflow-hidden">
                {workspace.members.map((member) => {
                  const isSelected = selectedRecipients.has(member.email);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleRecipient(member)}
                      disabled={isSending}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 transition-colors text-left ${
                        isSelected ? "bg-white/4" : "hover:bg-white/2"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-sans text-sm text-foreground truncate leading-tight">
                          {member.name ?? (
                            <span className="text-muted-foreground italic">
                              No name
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground truncate leading-tight">
                          {member.email}
                        </span>
                      </div>
                      <div
                        className={`h-4 w-4 border shrink-0 ml-3 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-foreground bg-foreground"
                            : "border-white/15"
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-background" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {someSelected && (
                <p className="font-sans text-xs text-muted-foreground">
                  <span className="font-mono tabular-nums text-foreground">
                    {selectedHere}
                  </span>{" "}
                  of{" "}
                  <span className="font-mono tabular-nums">
                    {workspace.members.length}
                  </span>{" "}
                  selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 gap-2 flex-wrap border-t border-white/8 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          onClick={() => router.push(`/events/${eventId}`)}
          disabled={isSending}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer"
          onClick={handleSend}
          disabled={isSending || selectedCount === 0}
        >
          <Send className="h-3.5 w-3.5" />
          {isSending
            ? "Sending..."
            : `Send to ${selectedCount} guest${selectedCount === 1 ? "" : "s"}`}
        </Button>
      </div>
    </div>
  );
}
