import { PollInviteEmail } from "@/components/poll-invite-email";
import { InviteEmail } from "@/components/email-template";
import { resend } from "../resend/index";
import { EmailData } from "../types/index";

const BATCH_SIZE = 50;

interface PollEmailRecipient {
  email: string;
  name: string | null;
  token: string;
}

interface SendPollInvitesParams {
  poll: {
    title: string;
    location: string | null;
    description: string | null;
    closesAt: Date | null;
  };
  options: { startAt: Date; endAt: Date | null }[];
  recipients: PollEmailRecipient[];
  organizer: { name: string; email: string };
}

function formatOptionLabel(option: { startAt: Date; endAt: Date | null }) {
  const start = option.startAt.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!option.endAt) return start;
  const end = option.endAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${start} – ${end}`;
}

export const PollEmailService = {
  async sendPollInvites(
    params: SendPollInvitesParams,
  ): Promise<{ batches: number; failed: number }> {
    const optionLabels = params.options.map(formatOptionLabel);

    const batchPayload: EmailData[] = params.recipients.map((rec) => ({
      from: process.env.FROM ?? "Invitely.gg <noreply@invitely.gg>",
      to: rec.email,
      subject: `Vote on a time: ${params.poll.title}`,
      react: PollInviteEmail({
        organizerName: params.organizer.name,
        organizerEmail: params.organizer.email,
        recipientName: rec.name ?? "",
        recipientEmail: rec.email,
        pollTitle: params.poll.title,
        pollLocation: params.poll.location,
        description: params.poll.description,
        closesAt: params.poll.closesAt,
        optionLabels,
        token: rec.token,
      }),
    }));

    const batches: EmailData[][] = [];
    for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
      batches.push(batchPayload.slice(i, i + BATCH_SIZE));
    }

    const results = await Promise.allSettled(
      batches.map((batch) => resend.batch.send(batch)),
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    return { batches: batches.length, failed };
  },

  async sendFinalizedEventInvites(params: {
    event: {
      name: string;
      eventAt: Date;
      location: string;
      emailSubject: string;
      emailBody: string;
    };
    invitations: {
      email: string;
      name: string | null;
      token: string;
      personalizedOpening: string | null;
    }[];
    organizer: { name: string; email: string };
  }): Promise<{ batches: number; failed: number; sent: number }> {
    const eventDate = params.event.eventAt.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const batchPayload: EmailData[] = params.invitations.map((inv) => ({
      from: process.env.FROM ?? "Invitely.gg <noreply@invitely.gg>",
      to: inv.email,
      subject: params.event.emailSubject,
      react: InviteEmail({
        organizerName: params.organizer.name,
        organizerEmail: params.organizer.email,
        recipientName: inv.name ?? "",
        recipientEmail: inv.email,
        eventName: params.event.name,
        eventDate,
        eventLocation: params.event.location,
        emailBody: params.event.emailBody,
        personalizedOpening: inv.personalizedOpening ?? "",
        token: inv.token,
      }),
    }));

    const batches: EmailData[][] = [];
    for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
      batches.push(batchPayload.slice(i, i + BATCH_SIZE));
    }

    const results = await Promise.allSettled(
      batches.map((batch) => resend.batch.send(batch)),
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    return {
      batches: batches.length,
      failed,
      sent: params.invitations.length,
    };
  },
};
