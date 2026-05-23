"use client";
import { EditEventDetails } from "@/components/edit/edit-event-details";
import { EditEmailContent } from "@/components/edit/edit-email-content";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Recurrence = "weekly" | "monthly" | "annually" | null;

interface EditEventFormProps {
  event: {
    id: string;
    name: string;
    desc: string;
    eventAt: Date;
    location: string;
    emailSubject: string;
    emailBody: string;
    recurrence: Recurrence;
    autoInvite: boolean | null;
  };
}

type Step = 1 | 2;

const stepTitles: Record<Step, string> = {
  1: "Event details",
  2: "Email content",
};

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSaving, setIsSaving] = useState(false);

  const eventAtLocal = new Date(event.eventAt);
  eventAtLocal.setMinutes(
    eventAtLocal.getMinutes() - eventAtLocal.getTimezoneOffset(),
  );
  const eventAtValue = eventAtLocal.toISOString().slice(0, 16);

  const [detailsValues, setDetailsValues] = useState({
    name: event.name,
    desc: event.desc,
    eventAt: eventAtValue,
    location: event.location,
    recurrence: event.recurrence ?? null,
    autoInvite: event.autoInvite ?? false,
  });

  async function handleSave(emailValues: {
    emailSubject: string;
    emailBody: string;
  }) {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
          name: detailsValues.name,
          desc: detailsValues.desc,
          eventAt: new Date(detailsValues.eventAt).toISOString(),
          location: detailsValues.location,
          emailSubject: emailValues.emailSubject,
          emailBody: emailValues.emailBody,
          recurrence: detailsValues.recurrence,
          autoInvite: detailsValues.autoInvite,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      if (data.data.notified) {
        toast.success("Event updated — guests notified of changes");
      } else {
        toast.success("Event updated successfully");
      }
      router.push(`/events/${event.id}`);
      router.refresh();
    } catch {
      toast.error("Failed to update event");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-x-auto -mx-1 px-1">
          {([1, 2] as Step[]).map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;
            return (
              <div key={step} className="flex items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center border font-mono text-[11px] font-semibold tabular-nums transition-colors ${
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : isCompleted
                          ? "border-white/15 bg-white/6 text-foreground"
                          : "border-white/8 bg-transparent text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : step}
                  </div>
                  <span
                    className={`font-sans text-xs font-medium hidden sm:block transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stepTitles[step]}
                  </span>
                </div>
                {index < 1 && (
                  <div
                    className={`mx-2 sm:mx-3 h-px w-6 sm:w-8 transition-colors ${
                      currentStep > step ? "bg-white/15" : "bg-white/8"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="font-sans text-sm h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 shrink-0 cursor-pointer"
          onClick={() => router.push(`/events/${event.id}`)}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
          Step {currentStep} of 2
        </p>
        <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">
          {stepTitles[currentStep]}
        </h2>
      </div>

      {currentStep === 1 && (
        <EditEventDetails
          initialValues={detailsValues}
          onNext={(values) => {
            setDetailsValues(values);
            setCurrentStep(2);
          }}
        />
      )}

      {currentStep === 2 && (
        <EditEmailContent
          initialValues={{
            emailSubject: event.emailSubject,
            emailBody: event.emailBody,
          }}
          eventName={detailsValues.name}
          eventDate={detailsValues.eventAt}
          eventLocation={detailsValues.location}
          eventDesc={detailsValues.desc}
          onBack={() => setCurrentStep(1)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
