import { $Enums } from "@prisma/client";

export interface PollOptionLite {
  id: string;
  startAt: Date;
  endAt: Date | null;
}

export interface PollOptionWithStats {
  id: string;
  startAt: Date;
  endAt: Date | null;
  voteCount: number;
  voters: { id: string; name: string | null; email: string }[];
}

export interface PollListItem {
  id: string;
  title: string;
  location: string | null;
  status: $Enums.PollStatus;
  closesAt: Date | null;
  finalEventId: string | null;
  finalizedAt: Date | null;
  createdAt: Date;
  optionCount: number;
  inviteeCount: number;
  responseCount: number;
}

export interface PollDetail {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  location: string | null;
  status: $Enums.PollStatus;
  closesAt: Date | null;
  finalEventId: string | null;
  finalEventName: string | null;
  finalizedAt: Date | null;
  createdAt: Date;
  options: PollOptionWithStats[];
  invitees: {
    id: string;
    email: string;
    name: string | null;
    respondedAt: Date | null;
  }[];
  responseCount: number;
}

export interface PollPublicView {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  closesAt: Date | null;
  status: $Enums.PollStatus;
  organizerName: string;
  options: { id: string; startAt: Date; endAt: Date | null }[];
  invitee: {
    id: string;
    email: string;
    name: string | null;
    respondedAt: Date | null;
  };
  votedOptionIds: string[];
}

export interface PollBestSlotInsight {
  optionId: string;
  reason: string;
  confidence: "low" | "medium" | "high";
}

export interface PollIdParams {
  params: Promise<{ pollId: string }>;
}

export interface PollTokenParams {
  params: Promise<{ token: string }>;
}

export const POLL_LIMITS = {
  /** Minimum slots a poll must have to be useful. */
  MIN_OPTIONS: 2,
  /** Maximum slots — keeps the UI scannable and the prompt small. */
  MAX_OPTIONS: 12,
  /** Maximum invitees per poll. */
  MAX_INVITEES: 50,
  /** Maximum polls per user (lifetime). Cheap guardrail. */
  MAX_POLLS_PER_USER: 50,
  /**
   * The earliest time slot must be at least this many hours in the future at
   * poll-create time. Auto-close happens 12h before the first slot, plus we
   * want at least 1 hour of voting window after that, so the floor is 13h.
   */
  MIN_FIRST_SLOT_HOURS_AHEAD: 13,
  /** How long before the earliest slot voting auto-closes. */
  AUTO_CLOSE_HOURS_BEFORE_FIRST_SLOT: 12,
} as const;
