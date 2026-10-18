import { TRPCError } from "@trpc/server";
import { and, count, eq, exists, gt, min, or, sql } from "drizzle-orm";
import type { db, Transaction } from "@/db";
import { Plan, publishEvents, shareLinks, snippets, users } from "@/db/schema";
import { limit } from "@/lib/billing/plans";

type Executor = Transaction | typeof db;

const DAY_MS = 86_400_000;
const withinLastDay = sql`now() - interval '24 hours'`;

export type PublishUsage = {
  dailyUsed: number;
  liveUsed: number;
  oldestDailyAt: Date | null;
};

export type PublishQuota = {
  dailyLimit: number | null;
  dailyUsed: number;
  dailyRemaining: number | null;
  dailyResetsAt: string | null;
  liveLimit: number | null;
  liveUsed: number;
  liveRemaining: number | null;
};

function finiteOrNull(value: number) {
  return Number.isFinite(value) ? value : null;
}

export function summarizeQuota(plan: Plan, usage: PublishUsage): PublishQuota {
  const dailyLimit = limit(plan, "dailyPublishes");
  const liveLimit = limit(plan, "maxLiveSnippets");
  return {
    dailyLimit: finiteOrNull(dailyLimit),
    dailyUsed: usage.dailyUsed,
    dailyRemaining: finiteOrNull(Math.max(0, dailyLimit - usage.dailyUsed)),
    dailyResetsAt: usage.oldestDailyAt ? new Date(usage.oldestDailyAt.getTime() + DAY_MS).toISOString() : null,
    liveLimit: finiteOrNull(liveLimit),
    liveUsed: usage.liveUsed,
    liveRemaining: finiteOrNull(Math.max(0, liveLimit - usage.liveUsed)),
  };
}

export function quotaViolation(plan: Plan, usage: PublishUsage, addsLiveSnippet: boolean): TRPCError | null {
  const dailyLimit = limit(plan, "dailyPublishes");
  if (usage.dailyUsed >= dailyLimit) {
    return new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Daily publish limit reached (${dailyLimit}/day). Upgrade for more publishes.`,
    });
  }
  const liveLimit = limit(plan, "maxLiveSnippets");
  if (addsLiveSnippet && usage.liveUsed >= liveLimit) {
    return new TRPCError({
      code: "FORBIDDEN",
      message: `Live snippet limit reached (${liveLimit}). Delete a snippet or upgrade to publish more.`,
    });
  }
  return null;
}

async function readPlan(executor: Executor, userId: string) {
  const [user] = await executor.select({ plan: users.plan }).from(users).where(eq(users.id, userId));
  return user?.plan ?? Plan.FREE;
}

async function readUsage(executor: Executor, userId: string): Promise<PublishUsage> {
  const [[daily], liveUsed] = await Promise.all([
    executor
      .select({ used: count(), oldest: min(publishEvents.createdAt) })
      .from(publishEvents)
      .where(and(eq(publishEvents.userId, userId), gt(publishEvents.createdAt, withinLastDay))),
    executor.$count(
      snippets,
      and(
        eq(snippets.userId, userId),
        or(
          eq(snippets.isPublic, true),
          exists(executor.select({ id: shareLinks.id }).from(shareLinks).where(eq(shareLinks.snippetId, snippets.id))),
        ),
      ),
    ),
  ]);
  return { dailyUsed: Number(daily?.used ?? 0), liveUsed, oldestDailyAt: daily?.oldest ? new Date(daily.oldest) : null };
}

export async function getPublishQuota(executor: Executor, userId: string): Promise<PublishQuota> {
  const [plan, usage] = await Promise.all([readPlan(executor, userId), readUsage(executor, userId)]);
  return summarizeQuota(plan, usage);
}

export async function consumePublishQuota(
  tx: Transaction,
  userId: string,
  { addsLiveSnippet }: { addsLiveSnippet: boolean },
): Promise<PublishQuota> {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`publish:${userId}`}))`);
  const plan = await readPlan(tx, userId);
  const usage = await readUsage(tx, userId);
  const violation = quotaViolation(plan, usage, addsLiveSnippet);
  if (violation) throw violation;
  await tx.insert(publishEvents).values({ userId });
  return summarizeQuota(plan, {
    dailyUsed: usage.dailyUsed + 1,
    liveUsed: usage.liveUsed + (addsLiveSnippet ? 1 : 0),
    oldestDailyAt: usage.oldestDailyAt ?? new Date(),
  });
}
