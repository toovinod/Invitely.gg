"use client";

import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export interface RecipientEntry {
  email: string;
  name: string | null;
}

interface WorkspaceMemberLite {
  id: string;
  name: string | null;
  email: string;
}

interface WorkspaceLite {
  id: string;
  name: string;
  members: WorkspaceMemberLite[];
}

interface WorkspaceRecipientPickerProps {
  workspaces: WorkspaceLite[];
  selected: Map<string, RecipientEntry>;
  onToggleRecipient: (entry: RecipientEntry) => void;
  onToggleWorkspace: (members: RecipientEntry[]) => void;
  showSelectionBadge?: boolean;
}

type WorkspaceSelectionState = "none" | "some" | "all";

export function WorkspaceRecipientPicker({
  workspaces,
  selected,
  onToggleRecipient,
  onToggleWorkspace,
  showSelectionBadge = true,
}: WorkspaceRecipientPickerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(workspaces.map((w) => w.id)),
  );

  function toggleExpanded(workspaceId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(workspaceId)) next.delete(workspaceId);
      else next.add(workspaceId);
      return next;
    });
  }

  function selectionStateOf(
    members: RecipientEntry[],
  ): WorkspaceSelectionState {
    if (members.length === 0) return "none";
    const count = members.filter((m) => selected.has(m.email)).length;
    if (count === 0) return "none";
    if (count === members.length) return "all";
    return "some";
  }

  if (workspaces.length === 0) {
    return (
      <div className="py-10 text-center border border-dashed border-white/8 bg-transparent">
        <p className="font-sans text-sm text-muted-foreground">
          No workspaces found. Create a workspace first.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {showSelectionBadge && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="font-sans text-sm text-muted-foreground">
            Pick the people you want to invite
          </p>
          {selected.size > 0 && (
            <span className="inline-flex items-center gap-1 border border-white/15 bg-white/6 px-2 h-6 font-mono text-xs tabular-nums text-foreground">
              {selected.size} selected
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col border border-white/8 bg-white/2 divide-y divide-white/6 overflow-hidden">
        {workspaces.map((workspace) => {
          const members: RecipientEntry[] = workspace.members.map((m) => ({
            email: m.email,
            name: m.name,
          }));
          const state = selectionStateOf(members);
          const isExpanded = expanded.has(workspace.id);
          const selectedHere = members.filter((m) =>
            selected.has(m.email),
          ).length;

          return (
            <div key={workspace.id}>
              <div className="flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-white/2 transition-colors">
                <Checkbox
                  checked={state === "all"}
                  data-state={state === "some" ? "indeterminate" : undefined}
                  onCheckedChange={() => onToggleWorkspace(members)}
                  disabled={members.length === 0}
                  className={
                    state === "some"
                      ? "data-[state=checked]:bg-foreground/50 cursor-pointer"
                      : "cursor-pointer"
                  }
                />
                <button
                  type="button"
                  className="flex flex-1 items-center justify-between gap-3 text-left cursor-pointer min-w-0"
                  onClick={() => toggleExpanded(workspace.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-sans text-sm font-medium text-foreground truncate">
                      {workspace.name}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                      {workspace.members.length}
                    </span>
                    {state === "some" && (
                      <span className="font-sans text-xs text-muted-foreground shrink-0 hidden sm:inline">
                        ({selectedHere} selected)
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                </button>
              </div>

              {isExpanded && workspace.members.length > 0 && (
                <div className="border-t border-white/6 bg-white/2 divide-y divide-white/4">
                  {workspace.members.map((member) => {
                    const entry: RecipientEntry = {
                      email: member.email,
                      name: member.name,
                    };
                    const isSelected = selected.has(member.email);
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 pl-8 sm:pl-10 transition-colors cursor-pointer ${
                          isSelected ? "bg-white/4" : "hover:bg-white/2"
                        }`}
                        onClick={() => onToggleRecipient(entry)}
                      >
                        <span onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            className="cursor-pointer"
                            checked={isSelected}
                            onCheckedChange={() => onToggleRecipient(entry)}
                          />
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          {member.name && (
                            <span className="font-sans text-sm text-foreground truncate leading-tight">
                              {member.name}
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-muted-foreground truncate leading-tight">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isExpanded && workspace.members.length === 0 && (
                <div className="px-8 sm:px-10 py-3 border-t border-white/6 bg-white/2">
                  <p className="font-sans text-xs text-muted-foreground italic">
                    No members in this workspace
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
