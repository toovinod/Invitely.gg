"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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

interface TemplateCreateDialogProps {
  onCreated?: () => void;
}

export function TemplateCreateDialog({ onCreated }: TemplateCreateDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const isValid = name.trim() && emailSubject.trim() && emailBody.trim();

  function handleOpenChange(val: boolean) {
    setOpen(val);
    if (!val) {
      setName("");
      setEmailSubject("");
      setEmailBody("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isLoading) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, emailSubject, emailBody }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("template created");
      setOpen(false);
      if (onCreated) {
        onCreated();
      } else {
        router.refresh();
      }
    } catch {
      toast.error("failed to create template");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="font-sans text-sm gap-1.5 cursor-pointer h-8"
        >
          <Plus className="h-3.5 w-3.5" />
          New template
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
          <DialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
            Create template
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-muted-foreground">
            Build a reusable email template with subject and body you can pull
            it into any event send.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-5 sm:px-6 py-5"
        >
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="template-name"
              className="font-sans text-sm font-medium text-foreground"
            >
              Template name
            </Label>
            <Input
              id="template-name"
              placeholder="Birthday Party"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-sans text-sm h-10 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="template-subject"
              className="font-sans text-sm font-medium text-foreground"
            >
              Email subject
            </Label>
            <Input
              id="template-subject"
              placeholder="You're invited to..."
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="font-sans text-sm h-10 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5"
              maxLength={150}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="template-body"
              className="font-sans text-sm font-medium text-foreground"
            >
              Email body
            </Label>
            <Textarea
              id="template-body"
              placeholder="Write your invite template here..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="font-sans text-sm min-h-32 resize-none px-3 py-2.5 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5"
              maxLength={5000}
            />
            <p className="font-sans text-xs text-muted-foreground">
              Use {"{{guest_name}}"} placeholders if you want they&apos;ll be
              filled automatically when you send.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-sans text-sm h-9 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-sans text-sm h-9 cursor-pointer"
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Creating..." : "Create template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
