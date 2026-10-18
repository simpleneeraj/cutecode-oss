import { afterEach, describe, expect, it } from "vitest";
import { clearMemoryStore } from "@/lib/kv/memory-store";
import { cacheGet, cacheSet, checkRateLimit, isRateLimited, recordRateLimitHit, type RateLimiter } from "./in-memory-store";

const limiter: RateLimiter = { points: 2, windowMs: 60_000, prefix: "test" };

describe("the kv-backed rate limiter and cache", () => {
  afterEach(() => {
    clearMemoryStore();
  });

  it("allows up to the limit in a window, then refuses", async () => {
    expect((await checkRateLimit(limiter, "user")).success).toBe(true);
    expect((await checkRateLimit(limiter, "user")).success).toBe(true);
    expect((await checkRateLimit(limiter, "user")).success).toBe(false);
    expect((await checkRateLimit(limiter, "other")).success).toBe(true);
  });

  it("reports limited only after enough recorded hits", async () => {
    await recordRateLimitHit(limiter, "ip");
    expect(await isRateLimited(limiter, "ip")).toBe(false);
    await recordRateLimitHit(limiter, "ip");
    expect(await isRateLimited(limiter, "ip")).toBe(true);
  });

  it("round-trips cached values with dates intact", async () => {
    const createdAt = new Date("2026-01-02T03:04:05.000Z");
    await cacheSet("profile", { name: "Ada", createdAt }, 60);
    expect(await cacheGet("profile")).toEqual({ name: "Ada", createdAt });
  });
});
