import { MemberDeleteDialog } from "@/components/workspace/member-delete-dialog";

interface Member {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface MemberListProps {
  members: Member[];
  workspaceId: string;
}

function getInitial(member: Member): string {
  const source = member.name?.trim() || member.email;
  return source.charAt(0).toUpperCase();
}

export function MemberList({ members, workspaceId }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="font-sans text-sm text-muted-foreground">
          No members yet. Add someone to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-white/5">
      {members.map((member: Member) => (
        <li
          key={member.id}
          className="flex items-center justify-between gap-3 py-2.5 group/member"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="shrink-0 size-7 rounded-full border border-white/8 bg-white/4 flex items-center justify-center font-sans text-xs font-medium text-foreground">
              {getInitial(member)}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              {member.name ? (
                <span className="font-sans text-sm text-foreground truncate leading-tight">
                  {member.name}
                </span>
              ) : (
                <span className="font-sans text-sm text-muted-foreground italic truncate leading-tight">
                  No name
                </span>
              )}
              <span className="font-mono text-[11px] text-muted-foreground truncate leading-tight">
                {member.email}
              </span>
            </div>
          </div>

          <div className="opacity-0 group-hover/member:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <MemberDeleteDialog
              memberId={member.id}
              memberEmail={member.email}
              workspaceId={workspaceId}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
