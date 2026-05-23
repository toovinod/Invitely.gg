"use client";
import { EventCreationState } from "@/app/hooks/use-event-creation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Sparkles,
  FileText,
  ChevronDown,
  BookmarkPlus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  emailSubject: string;
  emailBody: string;
}

interface StepWriteInviteProps {
  state: EventCreationState;
  setField: <K extends keyof EventCreationState>(
    key: K,
    value: EventCreationState[K],
  ) => void;
  onNext: () => void;
  onBack: () => void;
  onPolish: (casualText: string) => Promise<void>;
}

const inputClass =
  "font-sans text-sm h-10 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5";
const textareaClass =
  "font-sans text-sm resize-none px-3 py-2.5 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5";

export function StepWriteInvite({
  state,
  setField,
  onNext,
  onBack,
  onPolish,
}: StepWriteInviteProps) {
  const [casualText, setCasualText] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isValid = state.emailSubject.trim() && state.emailBody.trim();
  const canSaveTemplate = isValid;

  async function handlePolish() {
    if (!casualText.trim()) return;
    await onPolish(casualText);
  }

  async function handleLoadTemplates() {
    if (templatesLoaded) return;
    try {
      setIsLoadingTemplates(true);
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (!data.success) {
        toast.error("Failed to load templates");
        return;
      }
      setTemplates(data.data);
      setTemplatesLoaded(true);
    } catch {
      toast.error("Failed to load templates");
    } finally {
      setIsLoadingTemplates(false);
    }
  }

  function handleUseTemplate(template: Template) {
    setField("emailSubject", template.emailSubject);
    setField("emailBody", template.emailBody);
    toast.success(`Template"${template.name}" applied`);
  }

  async function handleSaveTemplate() {
    if (!templateName.trim() || !isValid) return;
    try {
      setIsSaving(true);
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName.trim(),
          emailSubject: state.emailSubject,
          emailBody: state.emailBody,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(`Template"${templateName}" saved`);
      setSaveDialogOpen(false);
      setTemplateName("");
      setTemplatesLoaded(false);
    } catch {
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden border border-white/8 bg-white/2 p-4 sm:p-5 flex flex-col gap-3.5">
        <div className="relative flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Improve with AI
            </p>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Write in a casual tone AI will turn it into a polished invite.
            </p>
          </div>

          <DropdownMenu
            onOpenChange={(open) => {
              if (open) handleLoadTemplates();
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-sans text-sm gap-1.5 h-8 shrink-0 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
              >
                <FileText className="h-3.5 w-3.5" />
                Use template
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isLoadingTemplates && (
                <DropdownMenuItem
                  disabled
                  className="font-sans text-sm text-muted-foreground"
                >
                  Loading...
                </DropdownMenuItem>
              )}
              {!isLoadingTemplates && templates.length === 0 && (
                <DropdownMenuItem
                  disabled
                  className="font-sans text-sm text-muted-foreground"
                >
                  No templates saved yet
                </DropdownMenuItem>
              )}
              {!isLoadingTemplates && templates.length > 0 && (
                <>
                  <DropdownMenuItem
                    disabled
                    className="font-sans text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    Select a template
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/6" />
                  {templates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      className="font-sans text-sm cursor-pointer"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Textarea
          placeholder={`e.g."bro it's my bday come party with us saturday night, gonna be lit"`}
          value={casualText}
          onChange={(e) => setCasualText(e.target.value)}
          className={`${textareaClass} min-h-20`}
          maxLength={1000}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-sans text-sm gap-1.5 self-start h-8 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          onClick={handlePolish}
          disabled={!casualText.trim() || state.isPolishing}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {state.isPolishing ? "Optimizing..." : "Optimize"}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/6" />
        <span className="font-sans text-xs text-muted-foreground">
          or write manually
        </span>
        <div className="h-px flex-1 bg-white/6" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email-subject"
            className="font-sans text-sm font-medium text-foreground"
          >
            Email subject <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email-subject"
            placeholder="You're invited to Shambavi's Birthday Party"
            value={state.emailSubject}
            onChange={(e) => setField("emailSubject", e.target.value)}
            className={inputClass}
            maxLength={150}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email-body"
            className="font-sans text-sm font-medium text-foreground"
          >
            Email body <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="email-body"
            placeholder="Write your invite message here..."
            value={state.emailBody}
            onChange={(e) => setField("emailBody", e.target.value)}
            className={`${textareaClass} min-h-44`}
            maxLength={5000}
          />
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            Skip the greeting and sign-off the email template handles those.
          </p>
        </div>
      </div>

      {canSaveTemplate && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="font-sans text-sm gap-1.5 h-8 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
            onClick={() => setSaveDialogOpen(true)}
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            Save as template
          </Button>
        </div>
      )}

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
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog
        open={saveDialogOpen}
        onOpenChange={(val) => {
          setSaveDialogOpen(val);
          if (!val) setTemplateName("");
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-white/6">
            <DialogTitle className="font-sans text-base font-semibold tracking-tight text-foreground">
              Save as template
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-5 sm:px-6 py-5">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="template-name"
                className="font-sans text-sm font-medium text-foreground"
              >
                Template name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="template-name"
                placeholder="Birthday Party"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className={inputClass}
                maxLength={100}
                autoFocus
              />
            </div>
            <div className="border border-white/8 bg-transparent px-3 py-2.5 flex flex-col gap-1">
              <p className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider">
                Subject preview
              </p>
              <p className="font-sans text-sm text-foreground truncate">
                {state.emailSubject}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-sm h-9 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
                onClick={() => setSaveDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="font-sans text-sm h-9 cursor-pointer"
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
