-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('open', 'finalized', 'cancelled');

-- CreateTable
CREATE TABLE "polls" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "closesAt" TIMESTAMP(3),
    "status" "PollStatus" NOT NULL DEFAULT 'open',
    "finalEventId" TEXT,
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_options" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_invitees" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "token" TEXT NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poll_invitees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_votes" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "polls_finalEventId_key" ON "polls"("finalEventId");

-- CreateIndex
CREATE INDEX "polls_userId_idx" ON "polls"("userId");

-- CreateIndex
CREATE INDEX "polls_userId_status_idx" ON "polls"("userId", "status");

-- CreateIndex
CREATE INDEX "poll_options_pollId_idx" ON "poll_options"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "poll_invitees_token_key" ON "poll_invitees"("token");

-- CreateIndex
CREATE INDEX "poll_invitees_pollId_idx" ON "poll_invitees"("pollId");

-- CreateIndex
CREATE INDEX "poll_invitees_token_idx" ON "poll_invitees"("token");

-- CreateIndex
CREATE UNIQUE INDEX "poll_invitees_pollId_email_key" ON "poll_invitees"("pollId", "email");

-- CreateIndex
CREATE INDEX "poll_votes_inviteeId_idx" ON "poll_votes"("inviteeId");

-- CreateIndex
CREATE UNIQUE INDEX "poll_votes_optionId_inviteeId_key" ON "poll_votes"("optionId", "inviteeId");

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_finalEventId_fkey" FOREIGN KEY ("finalEventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_invitees" ADD CONSTRAINT "poll_invitees_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "poll_invitees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
