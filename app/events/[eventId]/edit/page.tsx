import { EditEventForm } from "@/components/edit/edit-event-form";
import { EditEventFormSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EventIdParams } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db/prisma";
import { Suspense } from "react";
import { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";

const getEvent = cache(async (eventId: string) => {
  return db.event.findUnique({ where: { id: eventId } });
});

export async function generateMetadata({
  params,
}: EventIdParams): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  return {
    title: event
      ? `Edit ${event.name} | Invitely.gg`
      : "Edit Event | Invitely.gg",
  };
}

async function EditSection({ eventId }: { eventId: string }) {
  const event = await getEvent(eventId);
  if (!event) notFound();
  return <EditEventForm event={event} />;
}

export default async function EditEventPage({ params }: EventIdParams) {
  const { eventId } = await params;
  const [session, event] = await Promise.all([getSession(), getEvent(eventId)]);

  if (!session) redirect("/login");
  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();
  if (event.status === "cancelled") redirect(`/events/${eventId}`);

  return (
    <div className="flex flex-col gap-6 sm:gap-7 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Edit event
          </h1>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed truncate">
            {event.name}
          </p>
        </div>
        <Link href={`/events/${eventId}`} className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to event
          </Button>
        </Link>
      </div>

      <Suspense fallback={<EditEventFormSkeleton />}>
        <EditSection eventId={eventId} />
      </Suspense>
    </div>
  );
}
