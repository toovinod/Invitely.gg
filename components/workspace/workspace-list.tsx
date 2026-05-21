import { WorkspaceCard } from "@/components/workspace/workspace-card";
import { Users } from "lucide-react";

interface Member {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface Workspace {
  id: string;
  name: string;
  members: Member[];
  createdAt: Date;
}

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className="border border-dashed border-border bg-card/40 flex flex-col items-center justify-center py-20 px-6 gap-4 text-center">
        <div className="rounded-full border border-border bg-muted/40 w-12 h-12 flex items-center justify-center">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-sans text-base font-medium text-foreground">
            No workspaces yet
          </h3>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Workspaces help you keep contacts organised. Start with one for
            family or your team — you can create up to five.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {workspaces.map((workspace: Workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
