import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Plan, SubscriptionStatus, subscriptions, users, type DbUser } from "@/db/schema";

export async function createUser(plan: Plan = Plan.FREE, overrides: Partial<DbUser> = {}): Promise<DbUser> {
  const id = randomUUID();
  const [user] = await db
    .insert(users)
    .values({ id, name: `User ${id.slice(0, 6)}`, email: `${id}@test.app`, plan, ...overrides })
    .returning();
  return user;
}

export async function readUser(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new Error(`user ${userId} missing`);
  return user;
}

export async function readSubscription(userId: string) {
  return db.query.subscriptions.findFirst({ where: eq(subscriptions.userId, userId) });
}

type SubscriptionSeed = Partial<typeof subscriptions.$inferInsert> & { userId: string };

export async function createSubscription(seed: SubscriptionSeed) {
  const now = Date.now();
  const [row] = await db
    .insert(subscriptions)
    .values({
      dodoSubscriptionId: `sub_${randomUUID()}`,
      plan: Plan.PREMIUM,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(now - 86_400_000),
      currentPeriodEnd: new Date(now + 29 * 86_400_000),
      ...seed,
    })
    .returning();
  return row;
}
