"use client";

import { useAddMembers } from "@/app/hooks/use-workspaces";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MemberAddDialogProps {
  workspaceId: string;
  workspaceName: string;
  currentMemberCount: number;
}

interface MemberRow {
  id: string;
  name: string;
  email: string;
}

const MAX_MEMBERS = 25;

function createRow(): MemberRow {
  return { id: crypto.randomUUID(), name: "", email: "" };
}

export function MemberAddDialog({
  workspaceId,
  workspaceName,
  currentMemberCount,
}: MemberAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<MemberRow[]>([createRow()]);
  const { addMembers, isLoading } = useAddMembers();

  const remainingSlots = MAX_MEMBERS - currentMemberCount;
  const isAtLimit = remainingSlots <= 0;
  const validCount = rows.filter((r) => r.email.trim()).length;

  function updateRow(id: string, field: "name" | "email", value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function addRow() {
    if (rows.length >= remainingSlots) {
      toast.error(
        `Only ${remainingSlots} slot${remainingSlots === 1 ? "" : "s"} remaining`,
      );
      return;
    }
    setRows((prev) => [...prev, createRow()]);
  }

  function removeRow(id: string) {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleClose() {
    setRows([createRow()]);
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validRows = rows.filter((r) => r.email.trim());
    if (validRows.length === 0) {
      toast.error("Add at least one email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validRows.filter(
      (r) => !emailRegex.test(r.email.trim()),
    );
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email: ${invalidEmails[0].email}`);
      return;
    }

    const members = validRows.map((r: MemberRow) => ({
      email: r.email.trim().toLowerCase(),
      name: r.name.trim() || undefined,
    }));

    const success = await addMembers(workspaceId, members);
    if (success) {
      handleClose();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (o ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm gap-1.5 h-8 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          disabled={isAtLimit}
          title={isAtLimit ? "Workspace is full (25/25)" : undefined}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add members
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <DialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Add members
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-muted-foreground">
            Adding to{" "}
            <span className="text-foreground font-medium">{workspaceName}</span>
            {" —"}
            <span className="font-mono text-xs">
              {currentMemberCount}/{MAX_MEMBERS}
            </span>{" "}
            slots used.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-5 sm:px-6 py-5"
        >
          <div className="grid grid-cols-[1fr_1fr_32px] gap-2 px-1">
            <Label className="font-sans text-xs font-medium text-muted-foreground">
              Name <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Label className="font-sans text-xs font-medium text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <div />
          </div>

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 -mr-1">
            {rows.map((row: MemberRow) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center"
              >
                <Input
                  placeholder="Shambavi"
                  value={row.name}
                  onChange={(e) => updateRow(row.id,"name", e.target.value)}
                  className="font-sans text-sm h-9 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5"
                />
                <Input
                  placeholder="shambavi@gmail.com"
                  type="email"
                  value={row.email}
                  onChange={(e) => updateRow(row.id,"email", e.target.value)}
                  className="font-mono text-sm h-9 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-9 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer disabled:opacity-30"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  aria-label="Remove row"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {rows.length < remainingSlots && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="font-sans text-sm gap-1.5 self-start h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
              onClick={addRow}
            >
              <Plus className="h-3.5 w-3.5" />
              Add another
            </Button>
          )}

          <DialogFooter className="pt-2 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-sans text-sm h-9 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-sans text-sm h-9 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading
                ? "Adding..."
                : `Add ${validCount ||""} member${validCount === 1 ? "" : "s"}`.trim()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
