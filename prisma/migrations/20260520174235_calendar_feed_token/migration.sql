-- CreateTable
CREATE TABLE "calendar_feed_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_feed_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calendar_feed_tokens_userId_key" ON "calendar_feed_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_feed_tokens_token_key" ON "calendar_feed_tokens"("token");

-- CreateIndex
CREATE INDEX "calendar_feed_tokens_token_idx" ON "calendar_feed_tokens"("token");

-- AddForeignKey
ALTER TABLE "calendar_feed_tokens" ADD CONSTRAINT "calendar_feed_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
