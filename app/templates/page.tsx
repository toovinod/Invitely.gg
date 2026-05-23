import { TemplateCreateDialog } from "@/components/templates/template-create-dialog";
import { TemplateList } from "@/components/templates/template-list";
import { TemplateListSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Templates | Invitely.gg" };

const MAX_TEMPLATES = 20;

function PageHeader() {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
        Templates
      </h1>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
        Save reusable email templates so you don&apos;t have to rewrite
        invitations from scratch.
      </p>
    </div>
  );
}

async function TemplateSection() {
  const session = await getSession();
  if (!session) redirect("/login");

  const templates = await db.eventTemplate.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      emailSubject: true,
      emailBody: true,
      createdAt: true,
      eventId: true,
      event: {
        select: { id: true, name: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
        <p className="font-sans text-sm text-muted-foreground">
          {templates.length === 0 ? (
            "Save your first template to reuse across events."
          ) : (
            <>
              <span className="font-mono tabular-nums text-foreground">
                {templates.length}
              </span>
              <span className="text-muted-foreground/70">/{MAX_TEMPLATES}</span>{" "}
              templates
            </>
          )}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <TemplateCreateDialog />
        </div>
      </div>

      <TemplateList templates={templates} />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <PageHeader />
      <Suspense fallback={<TemplateListSkeleton />}>
        <TemplateSection />
      </Suspense>
    </div>
  );
}
