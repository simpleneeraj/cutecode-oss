import { and, eq, inArray, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { SubscriptionStatus, Plan } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authorization = req.headers.get("authorization") ?? "";
  return timingSafeEqual(digest(authorization), digest(`Bearer ${cronSecret}`));
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = {
    expiredCount: 0,
    errors: [] as string[],
    ranAt: now.toISOString(),
  };

  try {
    const toExpire = await db.query.subscriptions.findMany({
      where: and(
        inArray(subscriptions.status, [SubscriptionStatus.PAST_DUE, SubscriptionStatus.UNPAID]),
        isNotNull(subscriptions.gracePeriodEnd),
        lte(subscriptions.gracePeriodEnd, now),
      ),
    });

    for (const sub of toExpire) {
      try {
        const expired = await db.transaction(async (tx) => {
          await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`billing:${sub.userId}`}))`);
          const updated = await tx
            .update(subscriptions)
            .set({ status: SubscriptionStatus.EXPIRED })
            .where(
              and(
                eq(subscriptions.id, sub.id),
                inArray(subscriptions.status, [SubscriptionStatus.PAST_DUE, SubscriptionStatus.UNPAID]),
                isNotNull(subscriptions.gracePeriodEnd),
                lte(subscriptions.gracePeriodEnd, now),
              ),
            )
            .returning({ id: subscriptions.id });
          if (updated.length === 0) return false;
          await tx.update(users).set({ plan: Plan.FREE }).where(eq(users.id, sub.userId));
          return true;
        });
        if (expired) results.expiredCount++;
      } catch (err) {
        const msg = `Expire ${sub.id}: ${err instanceof Error ? err.message : String(err)}`;
        console.error(`[cron:billing] ${msg}`);
        results.errors.push(msg);
      }
    }
  } catch (err) {
    results.errors.push(`Step 1 (expire) failed: ${String(err)}`);
  }

  const level = results.errors.length > 0 ? "warn" : "info";
  console[level]("[cron:billing]", results);

  return NextResponse.json(results, { status: results.errors.length > 0 ? 207 : 200 });
}
