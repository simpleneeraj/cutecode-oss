import "server-only";
import { kv } from "@/lib/kv";

export type RateLimiter = { points: number; windowMs: number; prefix: string };

type RateLimitResult = { success: boolean; limit?: number; remaining?: number; reset?: number };

type Window = { key: string; secondsLeft: number; reset: number };

function rl(points: number, windowMs: number, prefix: string): RateLimiter {
  return { points, windowMs, prefix };
}

const MINUTE = 60_000;

export const publishRateLimit = rl(10, MINUTE, "publish");

export const socialRateLimit = rl(30, MINUTE, "social");

export const apiRateLimit = rl(120, MINUTE, "api");

export const commentRateLimit = rl(20, MINUTE, "comment");

export const passcodeRateLimit = rl(5, 15 * MINUTE, "passcode");

export const passcodeShareRateLimit = rl(30, 60 * MINUTE, "passcode-share");

export const brandRequestRateLimit = rl(3, 60 * MINUTE, "brand-request");

function currentWindow(limiter: RateLimiter, identifier: string): Window {
  const now = Date.now();
  const bucket = Math.floor(now / limiter.windowMs);
  const reset = (bucket + 1) * limiter.windowMs;
  return {
    key: `rate-limit|${limiter.prefix}|${bucket}|${identifier}`,
    secondsLeft: Math.max(1, Math.ceil((reset - now) / 1000)),
    reset,
  };
}

export async function isRateLimited(limiter: RateLimiter, identifier: string): Promise<boolean> {
  try {
    const count = await kv().get(currentWindow(limiter, identifier).key);
    return Number(count ?? 0) >= limiter.points;
  } catch (error) {
    console.error("[rate-limit] store unavailable:", error);
    return true;
  }
}

export async function recordRateLimitHit(limiter: RateLimiter, identifier: string) {
  const { key, secondsLeft } = currentWindow(limiter, identifier);
  await kv().incr(key, secondsLeft);
}

export async function checkRateLimit(limiter: RateLimiter, identifier: string): Promise<RateLimitResult> {
  const { key, secondsLeft, reset } = currentWindow(limiter, identifier);
  try {
    const count = await kv().incr(key, secondsLeft);
    if (count > limiter.points) return { success: false, limit: limiter.points, remaining: 0, reset };
    return { success: true, limit: limiter.points, remaining: limiter.points - count, reset };
  } catch (error) {
    console.error("[rate-limit] store unavailable:", error);
    return { success: false };
  }
}

function cacheKey(key: string) {
  return `cache|${key}`;
}

function encodeDates(this: Record<string, unknown>, key: string, value: unknown) {
  const raw = this[key];
  if (raw instanceof Date) return { $date: raw.toISOString() };
  return value;
}

function decodeDates(_key: string, value: unknown) {
  if (typeof value === "object" && value !== null && "$date" in value && typeof value.$date === "string") {
    return new Date(value.$date);
  }
  return value;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  try {
    await kv().set(cacheKey(key), JSON.stringify(value, encodeDates), ttlSeconds);
  } catch (error) {
    console.error("[cache] set failed:", error);
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await kv().get(cacheKey(key));
    if (raw === null) return null;
    return JSON.parse(raw, decodeDates) as T;
  } catch (error) {
    console.error("[cache] get failed:", error);
    return null;
  }
}

export async function cacheDel(key: string) {
  try {
    await kv().del(cacheKey(key));
  } catch (error) {
    console.error("[cache] delete failed:", error);
  }
}
