"use client";
import { OrganizerNoteInput } from "@/components/dashboard/organizer-note-input";
import { ResendLinkButton } from "@/components/dashboard/resend-link-button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
  X,
  Clock,
} from "lucide-react";

type InvitationStatus = "pending" | "attending" | "maybe" | "declined";

interface Invitation {
  id: string;
  name: string | null;
  email: string;
  status: InvitationStatus;
  sentAt: Date;
  respondedAt: Date | null;
  openedAt: Date | null;
  guestNote: string | null;
  organizerNote: string | null;
}

interface GuestTableProps {
  invitations: Invitation[];
  eventId: string;
  isScheduled?: boolean;
}

const statusConfig: Record<
  InvitationStatus,
  {
    label: string;
    className: string;
    Icon: typeof Check;
  }
> = {
  attending: {
    label: "Attending",
    Icon: Check,
    className: "border-white/15 bg-white/6 text-foreground",
  },
  maybe: {
    label: "Maybe",
    Icon: HelpCircle,
    className: "border-white/8 bg-white/3 text-muted-foreground",
  },
  declined: {
    label: "Declined",
    Icon: X,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  pending: {
    label: "Pending",
    Icon: Clock,
    className: "border-white/8 bg-transparent text-muted-foreground",
  },
};

function StatusBadge({ status }: { status: InvitationStatus }) {
  const { label, Icon, className } = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1 border px-1.5 h-5 font-sans text-[11px] ${className}`}
    >
      <Icon className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GuestRow({
  inv,
  eventId,
  isScheduled,
}: {
  inv: Invitation;
  eventId: string;
  isScheduled?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasNotes = !!inv.guestNote || !!inv.organizerNote;

  return (
    <>
      <TableRow className="border-white/6 hover:bg-white/2">
        <TableCell className="font-sans text-sm text-foreground px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span>
              {inv.name ?? (
                <span className="text-muted-foreground italic">No name</span>
              )}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground md:hidden">
              {inv.email}
            </span>
          </div>
        </TableCell>

        <TableCell className="font-mono text-xs text-muted-foreground px-4 py-3 hidden md:table-cell">
          {inv.email}
        </TableCell>

        <TableCell className="px-4 py-3">
          <StatusBadge status={inv.status} />
        </TableCell>

        <TableCell className="px-4 py-3 hidden lg:table-cell">
          <Tooltip>
            <TooltipTrigger asChild>
              {inv.openedAt ? (
                <span className="inline-flex items-center gap-1 border border-white/15 bg-white/4 px-1.5 h-5 font-sans text-[11px] text-foreground cursor-default">
                  Opened
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 border border-white/8 bg-transparent px-1.5 h-5 font-sans text-[11px] text-muted-foreground cursor-default">
                  Unknown
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent className="font-sans text-xs max-w-48">
              {inv.openedAt
                ? `Opened ${new Date(inv.openedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                : "Cannot confirm — recipient may have images blocked"}
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="font-mono text-xs text-muted-foreground px-4 py-3 hidden lg:table-cell tabular-nums">
          {formatDate(inv.respondedAt)}
        </TableCell>

        <TableCell className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            {!isScheduled && (
              <ResendLinkButton eventId={eventId} email={inv.email} />
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              className={`h-7 w-7 transition-colors cursor-pointer hover:bg-white/4 ${
                hasNotes
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="border-white/6 bg-white/2 hover:bg-white/2">
          <TableCell colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Guest note
                </span>
                {inv.guestNote ? (
                  <p className="font-sans text-sm text-foreground/90 leading-relaxed wrap-break-words whitespace-pre-wrap">
                    {inv.guestNote}
                  </p>
                ) : (
                  <span className="font-sans text-sm text-muted-foreground/40 italic">
                    No note from guest
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Your private note
                </span>
                <OrganizerNoteInput
                  invitationId={inv.id}
                  initialNote={inv.organizerNote}
                />
              </div>
              <div className="flex flex-col gap-1 lg:hidden">
                <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Opened
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {inv.openedAt ? formatDate(inv.openedAt) : "Unknown"}
                </span>
              </div>
              <div className="flex flex-col gap-1 lg:hidden">
                <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Responded
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatDate(inv.respondedAt)}
                </span>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function GuestTable({
  invitations,
  eventId,
  isScheduled,
}: GuestTableProps) {
  if (invitations.length === 0) {
    return (
      <div className="border border-white/8 bg-white/2 py-12 text-center">
        <p className="font-sans text-sm text-muted-foreground">
          No invitations sent yet
        </p>
      </div>
    );
  }

  const order: InvitationStatus[] = [
    "attending",
    "maybe",
    "pending",
    "declined",
  ];
  const sorted = [...invitations].sort(
    (a, b) => order.indexOf(a.status) - order.indexOf(b.status),
  );

  return (
    <TooltipProvider>
      <div className="border border-white/8 bg-white/2 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/6">
              <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider h-10 px-4 font-medium">
                Name
              </TableHead>
              <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider h-10 px-4 hidden md:table-cell font-medium">
                Email
              </TableHead>
              <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider h-10 px-4 font-medium">
                Status
              </TableHead>
              <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider h-10 px-4 hidden lg:table-cell font-medium">
                Opened
              </TableHead>
              <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider h-10 px-4 hidden lg:table-cell font-medium">
                Responded
              </TableHead>
              <TableHead className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider h-10 px-4 text-right font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((inv: Invitation) => (
              <GuestRow
                key={inv.id}
                inv={inv}
                eventId={eventId}
                isScheduled={isScheduled}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
