import { describe, it, expect, afterEach, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { Plan, SubscriptionStatus, subscriptions, webhookEvents, type DbUser } from "@/db/schema";
import { POST } from "@/app/api/auth/[...all]/route";
import { GET as runBillingCron } from "@/app/api/cron/billing/route";
import { callerFor } from "./support/caller";
import { createSubscription, createUser, readSubscription, readUser } from "./support/factories";
import { CRON_SECRET, PRODUCT } from "./support/env";
import { authRequest, sessionCookie, webhookRequest } from "./support/http";

const DAY_MS = 86_400_000;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

type EventOptions = {
  subscriptionId?: string;
  productId?: string;
  status?: string;
  at?: Date;
  nextBillingDate?: Date;
  cancelAtNextBillingDate?: boolean;
  extra?: Record<string, unknown>;
};

function subscriptionEvent(type: string, user: DbUser, options: EventOptions = {}) {
  const at = options.at ?? new Date();
  const next = options.nextBillingDate ?? new Date(at.getTime() + 30 * DAY_MS);
  return {
    business_id: "bus_test",
    type,
    timestamp: at.toISOString(),
    data: {
      payload_type: "Subscription",
      addons: [],
      billing: { city: null, country: "US", state: null, street: null, zipcode: null },
      brand_id: "brand_test",
      cancel_at_next_billing_date: options.cancelAtNextBillingDate ?? false,
      created_at: new Date(at.getTime() - 30 * DAY_MS).toISOString(),
      credit_entitlement_cart: [],
      currency: "USD",
      customer: { customer_id: `cus_${user.id}`, email: user.email, name: user.name },
      metadata: {},
      meter_credit_entitlement_cart: [],
      meters: [],
      next_billing_date: next.toISOString(),
      on_demand: false,
      payment_frequency_count: 1,
      payment_frequency_interval: "Month",
      previous_billing_date: new Date(next.getTime() - 30 * DAY_MS).toISOString(),
      product_id: options.productId ?? PRODUCT.PREMIUM_MONTHLY,
      quantity: 1,
      recurring_pre_tax_amount: 1200,
      status: options.status ?? "active",
      subscription_id: options.subscriptionId ?? "sub_main",
      subscription_period_count: 12,
      subscription_period_interval: "Month",
      tax_inclusive: false,
      trial_period_days: 0,
      ...options.extra,
    },
  };
}

async function deliver(payload: object, options?: Parameters<typeof webhookRequest>[1]) {
  return POST(webhookRequest(payload, options) as NextRequest);
}

async function deliverOk(payload: object) {
  const response = await deliver(payload);
  expect(response.status).toBe(200);
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

describe("dodo webhook authenticity", () => {
  it("rejects a bad signature with 401 and changes nothing", async () => {
    const user = await createUser();
    const response = await deliver(subscriptionEvent("subscription.active", user), {
      secret: `whsec_${Buffer.from("not-the-real-secret").toString("base64")}`,
    });
    expect(response.status).toBe(401);
    expect((await readUser(user.id)).plan).toBe(Plan.FREE);
  });

  it("rejects a request without signature headers with 401", async () => {
    const user = await createUser();
    const request = new Request(webhookRequest(subscriptionEvent("subscription.active", user)), {
      headers: { "content-type": "application/json" },
    });
    const response = await POST(request as NextRequest);
    expect(response.status).toBe(401);
    expect((await readUser(user.id)).plan).toBe(Plan.FREE);
  });

  it("treats a replayed delivery as a no-op", async () => {
    const user = await createUser();
    const payload = subscriptionEvent("subscription.active", user);
    await deliverOk(payload);
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
    await deliverOk(subscriptionEvent("subscription.cancelled", user, { status: "cancelled", at: new Date(Date.now() + 1000) }));
    expect((await readUser(user.id)).plan).toBe(Plan.FREE);
    const replay = await deliver(payload);
    expect(replay.status).toBeLessThan(300);
    expect((await readUser(user.id)).plan).toBe(Plan.FREE);
    expect(await db.$count(webhookEvents)).toBe(2);
  });
});

describe("subscription lifecycle", () => {
  it.each([
    [PRODUCT.PRO_MONTHLY, Plan.PRO],
    [PRODUCT.PRO_YEARLY, Plan.PRO],
    [PRODUCT.PREMIUM_MONTHLY, Plan.PREMIUM],
    [PRODUCT.PREMIUM_YEARLY, Plan.PREMIUM],
  ])("activation of %s grants %s", async (productId, plan) => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { productId }));
    expect((await readUser(user.id)).plan).toBe(plan);
    expect(await readSubscription(user.id)).toMatchObject({ plan, status: SubscriptionStatus.ACTIVE });
  });

  it("activation refreshes the cached tRPC context", async () => {
    const user = await createUser();
    await callerFor(user);
    await deliverOk(subscriptionEvent("subscription.active", user));
    const caller = await callerFor(user);
    await expect(caller.billing.status()).resolves.toMatchObject({ plan: Plan.PREMIUM });
  });

  it("an unknown product does not grant Premium", async () => {
    const user = await createUser();
    await deliver(subscriptionEvent("subscription.active", user, { productId: "pdt_unknown" }));
    expect((await readUser(user.id)).plan).not.toBe(Plan.PREMIUM);
  });

  it("renewal keeps the plan and moves the period end", async () => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { at: minutesAgo(10) }));
    const next = new Date(Date.now() + 60 * DAY_MS);
    await deliverOk(subscriptionEvent("subscription.renewed", user, { nextBillingDate: next }));
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
    expect((await readSubscription(user.id))?.currentPeriodEnd.toISOString()).toBe(next.toISOString());
  });

  it("an old Pro subscription renewing does not downgrade Premium", async () => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { subscriptionId: "sub_pro", productId: PRODUCT.PRO_MONTHLY, at: minutesAgo(30) }));
    await deliverOk(subscriptionEvent("subscription.active", user, { subscriptionId: "sub_premium", productId: PRODUCT.PREMIUM_MONTHLY, at: minutesAgo(20) }));
    await deliver(subscriptionEvent("subscription.renewed", user, { subscriptionId: "sub_pro", productId: PRODUCT.PRO_MONTHLY, at: minutesAgo(10) }));
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
  });

  it("cancel at period end keeps the plan and flags it", async () => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { at: minutesAgo(10) }));
    await deliverOk(subscriptionEvent("subscription.updated", user, { cancelAtNextBillingDate: true }));
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
    expect(await readSubscription(user.id)).toMatchObject({ cancelAtPeriodEnd: true });
  });

  it("cancellation once the period is over downgrades to Free", async () => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { at: minutesAgo(10) }));
    await deliverOk(
      subscriptionEvent("subscription.cancelled", user, { status: "cancelled", nextBillingDate: minutesAgo(1) }),
    );
    expect((await readUser(user.id)).plan).toBe(Plan.FREE);
    expect(await readSubscription(user.id)).toMatchObject({ status: SubscriptionStatus.CANCELED });
  });

  it("expiry downgrades to Free", async () => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { at: minutesAgo(10) }));
    await deliverOk(subscriptionEvent("subscription.expired", user, { status: "expired" }));
    expect((await readUser(user.id)).plan).toBe(Plan.FREE);
    expect(await readSubscription(user.id)).toMatchObject({ status: SubscriptionStatus.EXPIRED });
  });

  it("on hold keeps the plan inside a grace period", async () => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { at: minutesAgo(10) }));
    await deliverOk(subscriptionEvent("subscription.on_hold", user, { status: "on_hold" }));
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
    const subscription = await readSubscription(user.id);
    expect(subscription?.status).toBe(SubscriptionStatus.PAST_DUE);
    expect(subscription?.gracePeriodEnd?.getTime()).toBeGreaterThan(Date.now());
  });

  it("past due keeps the plan until the dunning deadline", async () => {
    const user = await createUser();
    const deadline = new Date(Date.now() + 3 * DAY_MS);
    await deliverOk(subscriptionEvent("subscription.active", user, { at: minutesAgo(10) }));
    await deliverOk(
      subscriptionEvent("subscription.past_due", user, { status: "past_due", extra: { past_due_ends_at: deadline.toISOString() } }),
    );
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
    expect(await readSubscription(user.id)).toMatchObject({ status: SubscriptionStatus.PAST_DUE, gracePeriodEnd: deadline });
  });

  it("ignores an event older than the last applied one", async () => {
    const user = await createUser();
    await deliverOk(subscriptionEvent("subscription.active", user, { at: minutesAgo(5) }));
    await deliver(subscriptionEvent("subscription.cancelled", user, { status: "cancelled", at: minutesAgo(10) }));
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
  });
});

describe("billing cron", () => {
  function cronRequest(authorization?: string) {
    const headers = new Headers();
    if (authorization) headers.set("authorization", authorization);
    return new NextRequest("http://localhost:3000/api/cron/billing", { headers });
  }

  async function pastDueUser(graceOffsetMs: number) {
    const user = await createUser(Plan.PREMIUM);
    await createSubscription({
      userId: user.id,
      status: SubscriptionStatus.PAST_DUE,
      gracePeriodEnd: new Date(Date.now() + graceOffsetMs),
    });
    return user;
  }

  it.each([undefined, "Bearer wrong", CRON_SECRET, `Basic ${CRON_SECRET}`])("rejects authorization %j", async (authorization) => {
    const user = await pastDueUser(-DAY_MS);
    const response = await runBillingCron(cronRequest(authorization));
    expect(response.status).toBe(401);
    expect((await readUser(user.id)).plan).toBe(Plan.PREMIUM);
  });

  it("rejects every request when CRON_SECRET is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const response = await runBillingCron(cronRequest("Bearer "));
    expect(response.status).toBe(401);
  });

  it("expires past-due users whose grace period ended and spares the rest", async () => {
    const expired = await pastDueUser(-DAY_MS);
    const inGrace = await pastDueUser(DAY_MS);
    const active = await createUser(Plan.PREMIUM);
    await createSubscription({ userId: active.id, gracePeriodEnd: new Date(Date.now() - DAY_MS) });
    const response = await runBillingCron(cronRequest(`Bearer ${CRON_SECRET}`));
    expect(response.status).toBe(200);
    expect((await readUser(expired.id)).plan).toBe(Plan.FREE);
    expect(await readSubscription(expired.id)).toMatchObject({ status: SubscriptionStatus.EXPIRED });
    expect((await readUser(inGrace.id)).plan).toBe(Plan.PREMIUM);
    expect((await readUser(active.id)).plan).toBe(Plan.PREMIUM);
  });

  it("the expired user loses Premium gates immediately", async () => {
    const user = await pastDueUser(-DAY_MS);
    await callerFor(user);
    await runBillingCron(cronRequest(`Bearer ${CRON_SECRET}`));
    const caller = await callerFor(user);
    await expect(caller.billing.status()).resolves.toMatchObject({ plan: Plan.FREE });
  });
});

describe("checkout", () => {
  function stubDodoCheckout() {
    const realFetch = globalThis.fetch;
    const calls: string[] = [];
    vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : String(input);
      if (!url.includes("dodopayments")) return realFetch(input, init);
      calls.push(url);
      const sessionId = `cks_${randomUUID()}`;
      return Response.json({ session_id: sessionId, checkout_url: `https://checkout.test/${sessionId}` });
    });
    return calls;
  }

  async function checkout(user: DbUser, slug = "premium-monthly") {
    return POST(authRequest("/dodopayments/checkout-session", { body: { slug }, cookie: await sessionCookie(user.id) }) as NextRequest);
  }

  it("lets a Free user start checkout", async () => {
    stubDodoCheckout();
    const response = await checkout(await createUser());
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ url: expect.stringContaining("checkout.test") });
  });

  it.each([SubscriptionStatus.ACTIVE, SubscriptionStatus.PAST_DUE, SubscriptionStatus.TRIALING])(
    "blocks checkout while a subscription is %s",
    async (status) => {
      const calls = stubDodoCheckout();
      const user = await createUser(Plan.PRO);
      await createSubscription({ userId: user.id, plan: Plan.PRO, status });
      const response = await checkout(user);
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
      expect(calls).toEqual([]);
    },
  );

  it("allows checkout again after the subscription expired", async () => {
    stubDodoCheckout();
    const user = await createUser();
    await createSubscription({ userId: user.id, status: SubscriptionStatus.EXPIRED });
    const response = await checkout(user);
    expect(response.status).toBe(200);
  });

  it("requires a session", async () => {
    stubDodoCheckout();
    const response = await POST(authRequest("/dodopayments/checkout-session", { body: { slug: "premium-monthly" } }) as NextRequest);
    expect(response.status).toBe(401);
    expect(await db.$count(subscriptions, eq(subscriptions.status, SubscriptionStatus.ACTIVE))).toBe(0);
  });
});
