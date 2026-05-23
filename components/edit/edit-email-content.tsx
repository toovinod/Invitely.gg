"use client";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface EditEmailContentProps {
  initialValues: {
    emailSubject: string;
    emailBody: string;
  };
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDesc: string;
  onBack: () => void;
  onSave: (values: { emailSubject: string; emailBody: string }) => void;
  isSaving: boolean;
}

const inputClass =
  "font-sans text-sm h-10 px-3 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5";
const textareaClass =
  "font-sans text-sm resize-none px-3 py-2.5 border-white/8 bg-transparent focus-visible:border-white/20 focus-visible:ring-white/5";

export function EditEmailContent({
  initialValues,
  eventName,
  eventDate,
  eventLocation,
  eventDesc,
  onBack,
  onSave,
  isSaving,
}: EditEmailContentProps) {
  const [emailSubject, setEmailSubject] = useState(initialValues.emailSubject);
  const [emailBody, setEmailBody] = useState(initialValues.emailBody);
  const [casualText, setCasualText] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);

  const isValid = emailSubject.trim() && emailBody.trim();

  async function handlePolish() {
    if (!casualText.trim()) return;
    try {
      setIsPolishing(true);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casualText,
          eventName,
          eventDate,
          eventLocation,
          eventDesc,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setEmailSubject(data.data.subject);
      setEmailBody(data.data.body);
      toast.success("Email polished");
    } catch {
      toast.error("Failed to polish email");
    } finally {
      setIsPolishing(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden border border-white/8 bg-white/2 p-4 sm:p-5 flex flex-col gap-3.5">
        <div className="relative flex flex-col gap-1">
          <p className="font-sans text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            Rewrite with AI
          </p>
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            Write in a casual tone AI will turn it into a polished invite.
          </p>
        </div>
        <Textarea
          placeholder={`e.g."bro it's my bday come party with us saturday night"`}
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
          disabled={!casualText.trim() || isPolishing}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isPolishing ? "Optimizing..." : "Optimize"}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/6" />
        <span className="font-sans text-xs text-muted-foreground">
          or edit manually
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
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
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
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            className={`${textareaClass} min-h-44`}
            maxLength={5000}
          />
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            Skip the greeting and sign-off the email template handles those.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-2 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-sans text-sm h-9 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          onClick={onBack}
          disabled={isSaving}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-sans text-sm h-9 cursor-pointer"
          onClick={() => onSave({ emailSubject, emailBody })}
          disabled={!isValid || isSaving}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
