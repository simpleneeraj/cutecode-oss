import "server-only";
import type { KvStore } from "./types";

type Entry = { value: string; expiresAt: number | null };

const entries = new Map<string, Entry>();

function expiresAt(ttlSec: number | undefined): number | null {
  return ttlSec ? Date.now() + ttlSec * 1000 : null;
}

function read(key: string): Entry | null {
  const entry = entries.get(key);
  if (!entry) return null;
  if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
    entries.delete(key);
    return null;
  }
  return entry;
}

export const memoryStore: KvStore = {
  get: async (key) => read(key)?.value ?? null,
  set: async (key, value, ttlSec) => {
    entries.set(key, { value, expiresAt: expiresAt(ttlSec) });
  },
  del: async (key) => {
    entries.delete(key);
  },
  getAndDelete: async (key) => {
    const value = read(key)?.value ?? null;
    entries.delete(key);
    return value;
  },
  incr: async (key, ttlSec, by = 1) => {
    const entry = read(key);
    const count = Number(entry?.value ?? 0) + by;
    entries.set(key, { value: String(count), expiresAt: entry ? entry.expiresAt : expiresAt(ttlSec) });
    return count;
  },
};

export function clearMemoryStore(): void {
  entries.clear();
}
