"use client";

import { Step } from "@/app/hooks/use-event-creation";
import { Check } from "lucide-react";

interface EventStepperProps {
  currentStep: Step;
}

const steps: { step: Step; label: string }[] = [
  { step: 1, label: "Details" },
  { step: 2, label: "Invite" },
  { step: 3, label: "Recipients" },
  { step: 4, label: "Preview" },
];

export function EventStepper({ currentStep }: EventStepperProps) {
  return (
    <div className="flex items-center gap-0 min-w-0 overflow-x-auto -mx-1 px-1">
      {steps.map(
        ({ step, label }: { step: Step; label: string }, index: number) => {
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;

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
                  className={`font-sans text-xs font-medium transition-colors hidden sm:block ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 sm:mx-3 h-px w-6 sm:w-8 transition-colors ${
                    currentStep > step ? "bg-white/15" : "bg-white/8"
                  }`}
                />
              )}
            </div>
          );
        },
      )}
    </div>
  );
}
