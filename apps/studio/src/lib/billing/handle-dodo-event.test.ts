import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";

type TestUser = { id: string; email: string; plan: string; dodoCustomerId: string | null };
type TestSubscription = { dodoSubscriptionId: string; lastEventAt: Date | null; status?: string; plan?: string };
type Row = Record<string, unknown>;

const mock = vi.hoisted(() => ({
  isDuplicate: false,
  userByCustomerId: null as TestUser | null,
  userByEmail: null as TestUser | null,
  userBySubscriptionCustomerId: null as TestUser | null,
  userLookups: 0,
  locks: [] as string[],
  locksBeforeSubscriptionRead: 0,
  userUpdate: undefined as Row | undefined,
  existingSubscription: undefined as TestSubscription | undefined,
  eventInserted: false,
  subscriptionValues: undefined as Row | undefined,
  subscriptionSet: undefined as Row | undefined,
  userPlan: undefined as unknown,
  failSubscriptionWrite: false,
}));

vi.mock("@/db", () => {
  const insertEvent = () => ({
    values: () => ({
      onConflictDoNothing: () => ({
        returning: async () => {
          mock.eventInserted = !mock.isDuplicate;
          return mock.isDuplicate ? [] : [{}];
        },
      }),
    }),
  });
  const insertSubscription = () => ({
    values: (values: Row) => ({
      onConflictDoUpdate: async ({ set }: { set: Row }) => {
        if (mock.failSubscriptionWrite) throw new Error("db down");
        mock.subscriptionValues = values;
        mock.subscriptionSet = set;
      },
    }),
  });
  const tx = {
    insert: (table: { dodoSubscriptionId?: unknown }) =>
      table.dodoSubscriptionId ? insertSubscription() : insertEvent(),
    query: {
      users: {
        findFirst: async () => {
          mock.userLookups += 1;
          return mock.userLookups === 1 ? (mock.userByCustomerId ?? undefined) : (mock.userByEmail ?? undefined);
        },
      },
      subscriptions: {
        findFirst: async ({ with: include }: { with?: object }) => {
          if (!include) {
            mock.locksBeforeSubscriptionRead = mock.locks.length;
            return mock.existingSubscription;
          }
          return mock.userBySubscriptionCustomerId ? { user: mock.userBySubscriptionCustomerId } : undefined;
        },
      },
    },
    execute: async (query: { queryChunks: unknown[] }) => {
      mock.locks.push(query.queryChunks.filter((chunk) => typeof chunk === "string").join(""));
    },
    update: () => ({
      set: (values: Row) => ({
        where: async () => {
          mock.userPlan = values.plan;
          mock.userUpdate = values;
        },
      }),
    }),
  };
  return {
    db: {
      transaction: async (run: (transaction: typeof tx) => Promise<unknown>) => {
        try {
          return await run(tx);
        } catch (error) {
          mock.eventInserted = false;
          throw error;
        }
      },
    },
  };
});

const { logger } = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/logger", () => ({ logger }));

const handler: { handle(payload: object): Promise<void> } = { handle: async () => undefined };
const handleDodoEvent = (payload: object) => handler.handle(payload);
beforeAll(async () => {
  process.env.NEXT_PUBLIC_DODO_PRODUCT_PREMIUM = "pdt_TEST_PREMIUM";
  process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY = "pdt_TEST_PRO_MONTHLY";
  process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY = "pdt_TEST_PRO_YEARLY";
  process.env.NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_MONTHLY = "pdt_TEST_PREMIUM_MONTHLY";
  process.env.NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_YEARLY = "pdt_TEST_PREMIUM_YEARLY";
  handler.handle = (await import("./handle-dodo-event")).handleDodoEvent;
});

const EVENT_AT = new Date("2026-01-15T00:00:00Z");

const subscriptionPayload = (type: string, data: Row = {}) => ({
  type,
  timestamp: EVENT_AT,
  data: {
    subscription_id: "sub_123",
    product_id: "pdt_TEST_PREMIUM",
    status: "active",
    customer: { email: "u@test.app", customer_id: "cust_1" },
    previous_billing_date: new Date("2026-01-01T00:00:00Z"),
    next_billing_date: new Date("2026-02-01T00:00:00Z"),
    cancel_at_next_billing_date: false,
    ...data,
  },
});

beforeEach(() => {
  mock.isDuplicate = false;
  mock.userByCustomerId = null;
  mock.userByEmail = { id: "u1", email: "u@test.app", plan: "FREE", dodoCustomerId: null };
  mock.userBySubscriptionCustomerId = null;
  mock.userLookups = 0;
  mock.locks = [];
  mock.locksBeforeSubscriptionRead = 0;
  mock.userUpdate = undefined;
  logger.error.mockClear();
  mock.existingSubscription = undefined;
  mock.eventInserted = false;
  mock.subscriptionValues = undefined;
  mock.subscriptionSet = undefined;
  mock.userPlan = undefined;
  mock.failSubscriptionWrite = false;
});

describe("handleDodoEvent", () => {
  it("does nothing on a duplicate delivery", async () => {
    mock.isDuplicate = true;
    await handleDodoEvent(subscriptionPayload("subscription.active"));
    expect(mock.userLookups).toBe(0);
    expect(mock.userPlan).toBeUndefined();
  });

  it("rolls back the idempotency row when processing fails, so a retry can run", async () => {
    mock.failSubscriptionWrite = true;
    await expect(handleDodoEvent(subscriptionPayload("subscription.active"))).rejects.toThrow("db down");
    expect(mock.eventInserted).toBe(false);
  });

  it("activates PREMIUM and stores the subscription and customer ids", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.active"));
    expect(mock.userPlan).toBe("PREMIUM");
    expect(mock.subscriptionSet).toMatchObject({
      plan: "PREMIUM",
      status: "ACTIVE",
      dodoSubscriptionId: "sub_123",
      dodoCustomerId: "cust_1",
      lastEventAt: EVENT_AT,
    });
  });

  it.each(["pdt_TEST_PRO_MONTHLY", "pdt_TEST_PRO_YEARLY"])("%s activates PRO", async (productId) => {
    await handleDodoEvent(subscriptionPayload("subscription.active", { product_id: productId }));
    expect(mock.userPlan).toBe("PRO");
    expect(mock.subscriptionSet).toMatchObject({ plan: "PRO" });
  });

  it.each(["pdt_TEST_PREMIUM_MONTHLY", "pdt_TEST_PREMIUM_YEARLY"])("%s activates PREMIUM", async (productId) => {
    await handleDodoEvent(subscriptionPayload("subscription.active", { product_id: productId }));
    expect(mock.userPlan).toBe("PREMIUM");
  });

  it("keeps the legacy premium product on PREMIUM", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.renewed", { product_id: "pdt_TEST_PREMIUM" }));
    expect(mock.userPlan).toBe("PREMIUM");
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("plan_changed from PRO to PREMIUM upgrades the plan", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.active", { product_id: "pdt_TEST_PRO_MONTHLY" }));
    expect(mock.userPlan).toBe("PRO");
    await handleDodoEvent(
      subscriptionPayload("subscription.plan_changed", { product_id: "pdt_TEST_PREMIUM_YEARLY", status: "active" }),
    );
    expect(mock.userPlan).toBe("PREMIUM");
    expect(mock.subscriptionSet).toMatchObject({ plan: "PREMIUM", status: "ACTIVE" });
  });

  it("matches the user by customer id before email", async () => {
    mock.userByCustomerId = { id: "u2", email: "other@test.app", plan: "FREE", dodoCustomerId: "cust_1" };
    await handleDodoEvent(subscriptionPayload("subscription.active"));
    expect(mock.userLookups).toBe(1);
    expect(mock.subscriptionValues).toMatchObject({ userId: "u2" });
  });

  it("falls back to email when no user has the customer id", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.renewed"));
    expect(mock.userLookups).toBe(2);
    expect(mock.subscriptionValues).toMatchObject({ userId: "u1" });
  });

  it("falls back to the subscription's customer id before email", async () => {
    mock.userBySubscriptionCustomerId = { id: "u3", email: "old@test.app", plan: "FREE", dodoCustomerId: null };
    await handleDodoEvent(subscriptionPayload("subscription.renewed"));
    expect(mock.userLookups).toBe(1);
    expect(mock.subscriptionValues).toMatchObject({ userId: "u3" });
  });

  it("stores the customer id on the user", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.active"));
    expect(mock.userUpdate).toMatchObject({ plan: "PREMIUM", dodoCustomerId: "cust_1" });
  });

  it("locks the user's billing before reading the subscription", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.active"));
    expect(mock.locks).toEqual(["billing:u1"]);
    expect(mock.locksBeforeSubscriptionRead).toBe(1);
  });

  it("keeps the current plan and logs an error for a paid subscription with an unknown product", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.active", { product_id: "pdt_UNKNOWN" }));
    expect(mock.userPlan).toBe("FREE");
    expect(logger.error).toHaveBeenCalled();
  });

  it("keeps PRO for a PRO user when an unknown product renews", async () => {
    mock.userByEmail = { id: "u1", email: "u@test.app", plan: "PRO", dodoCustomerId: null };
    await handleDodoEvent(subscriptionPayload("subscription.renewed", { product_id: "pdt_UNKNOWN" }));
    expect(mock.userPlan).toBe("PRO");
  });

  it("downgrades a cancelled subscription with an unknown product to FREE", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.cancelled", { product_id: "pdt_UNKNOWN" }));
    expect(mock.userPlan).toBe("FREE");
  });

  it.each(["subscription.cancelled", "subscription.expired", "subscription.failed", "subscription.paused"])(
    "%s downgrades to FREE",
    async (type) => {
      await handleDodoEvent(subscriptionPayload(type));
      expect(mock.userPlan).toBe("FREE");
      expect(mock.subscriptionSet).toMatchObject({ gracePeriodEnd: null });
    },
  );

  it("failed maps to EXPIRED without grace", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.failed"));
    expect(mock.subscriptionSet).toMatchObject({ status: "EXPIRED", gracePeriodEnd: null });
  });

  it("past_due keeps PREMIUM until past_due_ends_at", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.past_due", { past_due_ends_at: "2026-02-04T00:00:00Z" }));
    expect(mock.userPlan).toBe("PREMIUM");
    expect(mock.subscriptionSet).toMatchObject({
      status: "PAST_DUE",
      gracePeriodEnd: new Date("2026-02-04T00:00:00Z"),
    });
  });

  it("past_due without a deadline falls back to the local grace period", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.past_due"));
    expect(mock.subscriptionSet).toMatchObject({ gracePeriodEnd: new Date("2026-02-08T00:00:00Z") });
  });

  it("updated with cancel at period end keeps PREMIUM and flags the cancellation", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.updated", { cancel_at_next_billing_date: true }));
    expect(mock.userPlan).toBe("PREMIUM");
    expect(mock.subscriptionSet).toMatchObject({ status: "ACTIVE", cancelAtPeriodEnd: true });
  });

  it("updated uses the status in the payload", async () => {
    await handleDodoEvent(subscriptionPayload("subscription.updated", { status: "cancelled" }));
    expect(mock.userPlan).toBe("FREE");
  });

  it("skips an event older than the last applied one", async () => {
    mock.existingSubscription = { dodoSubscriptionId: "sub_123", lastEventAt: new Date("2026-01-20T00:00:00Z") };
    await handleDodoEvent(subscriptionPayload("subscription.cancelled"));
    expect(mock.userPlan).toBeUndefined();
  });

  it("does not let an old subscription's cancel downgrade a resubscribed user", async () => {
    mock.existingSubscription = { dodoSubscriptionId: "sub_new", lastEventAt: new Date("2026-01-10T00:00:00Z") };
    await handleDodoEvent(subscriptionPayload("subscription.cancelled"));
    expect(mock.userPlan).toBeUndefined();
  });

  it("does not let an old PRO subscription's renewal downgrade an active PREMIUM user", async () => {
    mock.existingSubscription = {
      dodoSubscriptionId: "sub_premium",
      lastEventAt: new Date("2026-01-10T00:00:00Z"),
      status: "ACTIVE",
      plan: "PREMIUM",
    };
    await handleDodoEvent(subscriptionPayload("subscription.renewed", { product_id: "pdt_TEST_PRO_MONTHLY" }));
    expect(mock.userPlan).toBeUndefined();
  });

  it("lets a PRO subscription apply once the PREMIUM one is no longer entitled", async () => {
    mock.existingSubscription = {
      dodoSubscriptionId: "sub_premium",
      lastEventAt: new Date("2026-01-10T00:00:00Z"),
      status: "CANCELED",
      plan: "FREE",
    };
    await handleDodoEvent(subscriptionPayload("subscription.renewed", { product_id: "pdt_TEST_PRO_MONTHLY" }));
    expect(mock.userPlan).toBe("PRO");
  });

  it("replaces the subscription id when a new subscription activates", async () => {
    mock.existingSubscription = { dodoSubscriptionId: "sub_old", lastEventAt: new Date("2026-01-10T00:00:00Z") };
    await handleDodoEvent(subscriptionPayload("subscription.active"));
    expect(mock.subscriptionSet).toMatchObject({ dodoSubscriptionId: "sub_123" });
  });

  it("ignores non-subscription events", async () => {
    await handleDodoEvent({ type: "payment.succeeded", timestamp: new Date(), data: {} });
    expect(mock.eventInserted).toBe(true);
    expect(mock.userLookups).toBe(0);
  });
});
