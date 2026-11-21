import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryBuilder, type SelectedFields } from "drizzle-orm/pg-core";
import type { Transaction } from "@/db";
import { Plan } from "@/db/enums";
import { consumePublishQuota, quotaViolation, summarizeQuota } from "./publish-quota";

vi.mock("@/db", () => ({ db: {} }));

const state: { plan: Plan; events: Date[]; live: number; locks: number; lockless: boolean } = {
  plan: Plan.FREE,
  events: [],
  live: 0,
  locks: 0,
  lockless: false,
};

let lockTail = Promise.resolve();

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function runTx<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
  let release = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  const tx = {
    execute: async () => {
      if (state.lockless) return;
      const previous = lockTail;
      lockTail = previous.then(() => held);
      await previous;
      state.locks += 1;
    },
    select: (fields: SelectedFields) => {
      if ("plan" in fields) return { from: () => ({ where: async () => [{ plan: state.plan }] }) };
      if ("used" in fields) {
        return {
          from: () => ({
            where: async () => {
              await tick();
              return [{ used: state.events.length, oldest: state.events[0] ?? null }];
            },
          }),
        };
      }
      return new QueryBuilder().select(fields);
    },
    $count: async () => state.live,
    insert: () => ({
      values: async () => {
        await tick();
        state.events.push(new Date());
      },
    }),
  };
  return fn(tx as unknown as Transaction).finally(release);
}

const consume = (addsLiveSnippet = true) =>
  runTx((tx) => consumePublishQuota(tx, "u1", { addsLiveSnippet }));

beforeEach(() => {
  Object.assign(state, { plan: Plan.FREE, events: [], live: 0, locks: 0, lockless: false });
  lockTail = Promise.resolve();
});

describe("billing/publish-quota", () => {
  it("summarizes remaining daily and live quota", () => {
    const oldest = new Date("2026-10-18T10:00:00Z");
    expect(summarizeQuota(Plan.FREE, { dailyUsed: 1, liveUsed: 24, oldestDailyAt: oldest })).toEqual({
      dailyLimit: 3,
      dailyUsed: 1,
      dailyRemaining: 2,
      dailyResetsAt: "2026-10-19T10:00:00.000Z",
      liveLimit: 25,
      liveUsed: 24,
      liveRemaining: 1,
    });
  });

  it("reports unlimited live snippets as null for paid plans", () => {
    const quota = summarizeQuota(Plan.PRO, { dailyUsed: 0, liveUsed: 500, oldestDailyAt: null });
    expect(quota).toMatchObject({ dailyLimit: 30, dailyRemaining: 30, liveLimit: null, liveRemaining: null, dailyResetsAt: null });
  });

  it("blocks at the daily limit of each plan", () => {
    expect(quotaViolation(Plan.FREE, { dailyUsed: 3, liveUsed: 0, oldestDailyAt: null }, false)?.code).toBe("TOO_MANY_REQUESTS");
    expect(quotaViolation(Plan.PRO, { dailyUsed: 29, liveUsed: 0, oldestDailyAt: null }, false)).toBeNull();
    expect(quotaViolation(Plan.PRO, { dailyUsed: 30, liveUsed: 0, oldestDailyAt: null }, false)?.code).toBe("TOO_MANY_REQUESTS");
    expect(quotaViolation(Plan.PREMIUM, { dailyUsed: 100, liveUsed: 0, oldestDailyAt: null }, false)?.code).toBe("TOO_MANY_REQUESTS");
  });

  it("caps live snippets on FREE only when the publish adds one", () => {
    const usage = { dailyUsed: 0, liveUsed: 25, oldestDailyAt: null };
    expect(quotaViolation(Plan.FREE, usage, true)?.code).toBe("FORBIDDEN");
    expect(quotaViolation(Plan.FREE, usage, false)).toBeNull();
    expect(quotaViolation(Plan.PRO, { ...usage, liveUsed: 10_000 }, true)).toBeNull();
  });

  it("records a publish event and returns the remaining quota", async () => {
    const quota = await consume();
    expect(state.events).toHaveLength(1);
    expect(state.locks).toBe(1);
    expect(quota).toMatchObject({ dailyUsed: 1, dailyRemaining: 2, liveUsed: 1, liveRemaining: 24 });
  });

  it("does not record an event when the quota is exhausted", async () => {
    state.events = [new Date(), new Date(), new Date()];
    await expect(consume()).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
    expect(state.events).toHaveLength(3);
  });

  it("frees a live slot after a snippet is deleted but keeps the daily count", async () => {
    state.live = 25;
    await expect(consume()).rejects.toMatchObject({ code: "FORBIDDEN" });
    state.live = 24;
    await expect(consume()).resolves.toMatchObject({ liveRemaining: 0, dailyUsed: 1 });
  });

  it("serializes parallel publishes so the daily limit cannot be overshot", async () => {
    const results = await Promise.allSettled(Array.from({ length: 6 }, () => consume(false)));
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(3);
    expect(state.events).toHaveLength(3);
  });

  it("would overshoot without the per-user lock", async () => {
    state.lockless = true;
    await Promise.allSettled(Array.from({ length: 6 }, () => consume(false)));
    expect(state.events.length).toBeGreaterThan(3);
  });
});
