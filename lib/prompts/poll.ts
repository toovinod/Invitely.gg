export interface PollBestSlotPromptData {
  title: string;
  inviteeCount: number;
  responseCount: number;
  options: { id: string; iso: string; voteCount: number }[];
}

export function generatePollBestSlotPrompt(
  data: PollBestSlotPromptData,
): string {
  const optionLines = data.options
    .map(
      (o, i) =>
        `${i + 1}. id=${o.id} | startsAt=${o.iso} | votes=${o.voteCount}/${data.responseCount}`,
    )
    .join("\n");

  return `
You are an event scheduling assistant. The host is choosing the best time slot from a poll.

Poll: ${data.title}
Total invitees: ${data.inviteeCount}
Responses received: ${data.responseCount}/${data.inviteeCount}

Slots (id | startsAt ISO | yes-votes / responses):
${optionLines}

Your job:
Pick the single best slot. Use these rules:
- Highest vote count wins.
- Tiebreaker 1: prefer the slot that maximises majority of total invitees (votes / inviteeCount).
- Tiebreaker 2: prefer earlier slots (sooner is better for momentum).
- Confidence:
  - "high" when the leading slot has more votes than the second AND >= 60% of responses voted for it
  - "medium" when there is a clear leader but consensus is weaker
  - "low" when ties are common or response count is < 3

Return ONLY valid JSON, no markdown, no backticks:
{
  "optionId": "<exact id from the list above>",
  "reason": "one sentence, max 20 words, referencing actual numbers",
  "confidence": "low" | "medium" | "high"
}
`.trim();
}
