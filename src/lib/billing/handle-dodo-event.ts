import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { WebhookPayload } from "@dodopayments/core/schemas";
import { db, type Transaction } from "@/db";
import { users, subscriptions, webhookEvents, Plan, SubscriptionStatus } from "@/db/schema";
import { GRACE_PERIOD_DAYS } from "@/lib/billing/constants";
import { planForProduct } from "@/lib/billing/products";
import { PLAN_ORDER } from "@/lib/billing/plans";
import { logger } from "@/lib/logger";

const DAY_MS = 86_400_000;

type Subscription = typeof subscriptions.$inferSelect;

const subscriptionDataSchema = z.object({
  subscription_id: z.string(),
  product_id: z.string(),
  status: z.string(),
  customer: z.object({ customer_id: z.string(), email: z.string() }),
  previous_billing_date: z.coerce.date(),
  next_billing_date: z.coerce.date(),
  cancel_at_next_billing_date: z.boolean().default(false),
  cancelled_at: z.coerce.date().nullish(),
  past_due_ends_at: z.coerce.date().nullish(),
});

type SubscriptionData = z.infer<typeof subscriptionDataSchema>;

const EVENT_DODO_STATUS: Record<string, string> = {
  "subscription.active": "active",
  "subscription.renewed": "active",
  "subscription.plan_changed": "active",
  "subscription.unpaused": "active",
  "subscription.on_hold": "on_hold",
  "subscription.past_due": "past_due",
  "subscription.paused": "paused",
  "subscription.failed": "failed",
  "subscription.cancelled": "cancelled",
  "subscription.expired": "expired",
};

const DODO_STATUS: Record<string, SubscriptionStatus> = {
  active: SubscriptionStatus.ACTIVE,
  past_due: SubscriptionStatus.PAST_DUE,
  on_hold: SubscriptionStatus.PAST_DUE,
  paused: SubscriptionStatus.UNPAID,
  failed: SubscriptionStatus.EXPIRED,
  cancelled: SubscriptionStatus.CANCELED,
  expired: SubscriptionStatus.EXPIRED,
};

export const ENTITLED_STATUSES = new Set<SubscriptionStatus>([
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
]);

function readDodoStatus(type: string, data: SubscriptionData): string | undefined {
  if (type === "subscription.updated") return data.status;
  return EVENT_DODO_STATUS[type];
}

function resolvePlan(status: SubscriptionStatus, productId: string, currentPlan: Plan): Plan {
  if (!ENTITLED_STATUSES.has(status)) return Plan.FREE;
  const plan = planForProduct(productId);
  if (plan) return plan;
  logger.error({ productId, currentPlan }, "[handleDodoEvent] unknown product on a paid subscription, keeping current plan");
  return currentPlan;
}

function resolveGracePeriodEnd(dodoStatus: string, data: SubscriptionData): Date | null {
  const fallback = new Date(data.next_billing_date.getTime() + GRACE_PERIOD_DAYS * DAY_MS);
  if (dodoStatus === "past_due") return data.past_due_ends_at ?? fallback;
  if (dodoStatus === "on_hold") return fallback;
  return null;
}

function isStaleOrForeign(
  existing: Subscription | undefined,
  subscriptionId: string,
  status: SubscriptionStatus,
  plan: Plan,
  eventAt: Date,
): boolean {
  if (!existing) return false;
  if (existing.lastEventAt && eventAt < existing.lastEventAt) return true;
  if (existing.dodoSubscriptionId === subscriptionId) return false;
  if (!ENTITLED_STATUSES.has(status)) return true;
  return ENTITLED_STATUSES.has(existing.status) && PLAN_ORDER[plan] < PLAN_ORDER[existing.plan];
}

async function findUser(tx: Transaction, customer: SubscriptionData["customer"]) {
  const byCustomerId = await tx.query.users.findFirst({
    where: eq(users.dodoCustomerId, customer.customer_id),
  });
  if (byCustomerId) return byCustomerId;
  const subscription = await tx.query.subscriptions.findFirst({
    where: eq(subscriptions.dodoCustomerId, customer.customer_id),
    with: { user: true },
  });
  if (subscription) return subscription.user;
  return tx.query.users.findFirst({ where: eq(users.email, customer.email.toLowerCase()) });
}

async function lockUserBilling(tx: Transaction, userId: string) {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`billing:${userId}`}))`);
}

async function applySubscriptionEvent(tx: Transaction, payload: WebhookPayload): Promise<void> {
  const { type, timestamp: eventAt } = payload;
  const parsed = subscriptionDataSchema.safeParse(payload.data);
  const dodoStatus = parsed.success ? readDodoStatus(type, parsed.data) : undefined;
  const status = dodoStatus ? DODO_STATUS[dodoStatus] : undefined;
  if (!parsed.success || !dodoStatus || !status) {
    logger.info({ type }, "[handleDodoEvent] ignoring event");
    return;
  }

  const { data } = parsed;
  const user = await findUser(tx, data.customer);
  if (!user) {
    logger.warn({ customerId: data.customer.customer_id }, "[handleDodoEvent] no user for customer");
    return;
  }

  await lockUserBilling(tx, user.id);
  const existing = await tx.query.subscriptions.findFirst({ where: eq(subscriptions.userId, user.id) });
  const plan = resolvePlan(status, data.product_id, user.plan);
  if (isStaleOrForeign(existing, data.subscription_id, status, plan, eventAt)) {
    logger.info({ type, subscriptionId: data.subscription_id }, "[handleDodoEvent] skipping stale event");
    return;
  }

  const values = {
    dodoSubscriptionId: data.subscription_id,
    dodoCustomerId: data.customer.customer_id,
    plan,
    status,
    currentPeriodStart: data.previous_billing_date,
    currentPeriodEnd: data.next_billing_date,
    gracePeriodEnd: resolveGracePeriodEnd(dodoStatus, data),
    cancelAtPeriodEnd: data.cancel_at_next_billing_date,
    canceledAt: data.cancelled_at ?? null,
    lastEventAt: eventAt,
  };

  await tx
    .insert(subscriptions)
    .values({ userId: user.id, ...values })
    .onConflictDoUpdate({ target: subscriptions.userId, set: values });
  await tx
    .update(users)
    .set({ plan, dodoCustomerId: data.customer.customer_id })
    .where(eq(users.id, user.id));
}

function buildEventId(payload: WebhookPayload): string {
  const parsed = subscriptionDataSchema.pick({ subscription_id: true }).safeParse(payload.data);
  const subscriptionId = parsed.success ? parsed.data.subscription_id : "none";
  return `${payload.type}:${subscriptionId}:${payload.timestamp.toISOString()}`;
}

export async function handleDodoEvent(payload: WebhookPayload): Promise<void> {
  await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(webhookEvents)
      .values({ id: buildEventId(payload), type: payload.type, rawPayload: payload })
      .onConflictDoNothing()
      .returning();
    if (inserted) await applySubscriptionEvent(tx, payload);
  });
}
