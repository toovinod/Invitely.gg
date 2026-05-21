"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
      <div className="py-8 text-center border border-dashed border-border">
        <p className="font-mono text-xs text-muted-foreground">
          No workspaces found. Create a workspace first.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {showSelectionBadge && (
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            Pick the people you want to invite
          </p>
          {selected.size > 0 && (
            <Badge
              variant="secondary"
              className="font-mono text-xs bg-foreground/10 text-foreground"
            >
              {selected.size} selected
            </Badge>
          )}
        </div>
      )}

      <div className="flex flex-col border border-border divide-y divide-border">
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
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
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
                  className="flex flex-1 items-center justify-between gap-3 text-left cursor-pointer"
                  onClick={() => toggleExpanded(workspace.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {workspace.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs px-1.5 py-0 h-4"
                    >
                      {workspace.members.length}
                    </Badge>
                    {state === "some" && (
                      <span className="font-mono text-xs text-muted-foreground">
                        ({selectedHere} selected)
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </button>
              </div>

              {isExpanded && workspace.members.length > 0 && (
                <div className="border-t border-border bg-muted/10 divide-y divide-border">
                  {workspace.members.map((member) => {
                    const entry: RecipientEntry = {
                      email: member.email,
                      name: member.name,
                    };
                    const isSelected = selected.has(member.email);
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 px-4 py-2.5 pl-10 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => onToggleRecipient(entry)}
                      >
                        {/*
                          Wrap the Checkbox in a span that swallows the click so
                          the row's onClick doesn't double-fire. Without this,
                          clicking the checkbox triggers both Radix's
                          onCheckedChange AND the bubbled row onClick — two
                          rapid setState calls per click which React 19 flags
                          as a potential infinite loop.
                         */}
                        <span onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            className="cursor-pointer"
                            checked={isSelected}
                            onCheckedChange={() => onToggleRecipient(entry)}
                          />
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          {member.name && (
                            <span className="font-mono text-xs text-foreground">
                              {member.name}
                            </span>
                          )}
                          <span className="font-mono text-xs text-muted-foreground truncate">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isExpanded && workspace.members.length === 0 && (
                <div className="px-10 py-3 border-t border-border bg-muted/10">
                  <p className="font-mono text-xs text-muted-foreground">
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
