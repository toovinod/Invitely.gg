import { TemplateDeleteDialog } from "@/components/templates/template-delete-dialog";
import { FileText } from "lucide-react";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    emailSubject: string;
    emailBody: string;
    createdAt: Date;
    event: { id: string; name: string } | null;
  };
  onDeleted: () => void;
}

export function TemplateCard({ template, onDeleted }: TemplateCardProps) {
  const preview =
    template.emailBody.length > 160
      ? template.emailBody.slice(0, 160) + "..."
      : template.emailBody;

  return (
    <div className="group relative flex flex-col overflow-hidden border border-white/8 bg-white/2 transition-all duration-300 hover:border-white/15 hover:bg-white/4">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileText className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground truncate">
            {template.name}
          </h3>
          {template.event && (
            <span className="inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide border-white/8 bg-white/3 text-muted-foreground shrink-0 truncate max-w-[40%]">
              {template.event.name}
            </span>
          )}
        </div>
        <TemplateDeleteDialog
          templateId={template.id}
          templateName={template.name}
          onDeleted={onDeleted}
        />
      </div>

      <div className="px-4 sm:px-5 py-4 flex flex-col gap-1.5">
        <p className="font-sans text-sm text-foreground truncate">
          {template.emailSubject}
        </p>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {preview}
        </p>
      </div>
    </div>
  );
}
