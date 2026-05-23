"use client";
import { TemplateCreateDialog } from "@/components/templates/template-create-dialog";
import { TemplateCard } from "@/components/templates/template-card";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

interface Template {
  id: string;
  name: string;
  emailSubject: string;
  emailBody: string;
  createdAt: Date;
  event: { id: string; name: string } | null;
}

interface TemplateListProps {
  templates: Template[];
}

export function TemplateList({ templates }: TemplateListProps) {
  const router = useRouter();

  function handleMutation() {
    router.refresh();
  }

  if (templates.length === 0) {
    return (
      <div className="relative overflow-hidden border border-dashed border-white/8 bg-transparent flex flex-col items-center justify-center py-16 sm:py-20 px-6 gap-4 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="relative shrink-0 rounded-full border border-white/8 bg-white/4 w-12 h-12 flex items-center justify-center">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="relative flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-sans text-base font-medium text-foreground">
            No templates yet
          </h3>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Save reusable email templates for your events drop them into any new
            send and tweak from there.
          </p>
        </div>
        <div className="relative">
          <TemplateCreateDialog onCreated={handleMutation} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {templates.map((template: Template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onDeleted={handleMutation}
        />
      ))}
    </div>
  );
}
