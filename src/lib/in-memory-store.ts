export type RateLimiter = { points: number; windowMs: number; prefix: string };

function rl(points: number, windowMs: number, prefix: string): RateLimiter {
  return { points, windowMs, prefix };
}

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export const publishRateLimit = rl(10, MINUTE, "publish");

export const socialRateLimit = rl(30, MINUTE, "social");

export const apiRateLimit = rl(120, MINUTE, "api");

export const commentRateLimit = rl(20, MINUTE, "comment");

export const passcodeRateLimit = rl(5, 15 * MINUTE, "passcode");

export const passcodeShareRateLimit = rl(30, 60 * MINUTE, "passcode-share");

const hits = new Map<string, number[]>();
let lastSweep = Date.now();

function maybeSweep(now: number) {
  if (now - lastSweep < 5 * MINUTE) return;
  lastSweep = now;
  for (const [key, times] of hits) {
    if (times.length === 0 || times[times.length - 1] < now - DAY) hits.delete(key);
  }
}

function recentHits(limiter: RateLimiter, identifier: string, now: number) {
  maybeSweep(now);
  const key = `${limiter.prefix}:${identifier}`;
  const recent = (hits.get(key) ?? []).filter((t) => t > now - limiter.windowMs);
  hits.set(key, recent);
  return recent;
}

export async function isRateLimited(limiter: RateLimiter, identifier: string): Promise<boolean> {
  return recentHits(limiter, identifier, Date.now()).length >= limiter.points;
}

export async function recordRateLimitHit(limiter: RateLimiter, identifier: string) {
  const now = Date.now();
  recentHits(limiter, identifier, now).push(now);
}

export async function checkRateLimit(
  limiter: RateLimiter,
  identifier: string,
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  try {
    const now = Date.now();
    const recent = recentHits(limiter, identifier, now);

    if (recent.length >= limiter.points) {
      return { success: false, limit: limiter.points, remaining: 0, reset: recent[0] + limiter.windowMs };
    }

    recent.push(now);
    return {
      success: true,
      limit: limiter.points,
      remaining: limiter.points - recent.length,
      reset: now + limiter.windowMs,
    };
  } catch {
    return { success: true };
  }
}

const cache = new Map<string, { value: unknown; expiresAt: number }>();

export async function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  cache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export async function cacheDel(key: string) {
  cache.delete(key);
}
