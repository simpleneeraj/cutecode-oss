import "server-only";

export type KvStore = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttlSec?: number) => Promise<void>;
  del: (key: string) => Promise<void>;
  getAndDelete: (key: string) => Promise<string | null>;
  incr: (key: string, ttlSec: number, by?: number) => Promise<number>;
};
