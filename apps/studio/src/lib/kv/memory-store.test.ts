import { afterEach, describe, expect, it, vi } from "vitest";
import { clearMemoryStore, memoryStore } from "./memory-store";

describe("the in-process kv store", () => {
  afterEach(() => {
    vi.useRealTimers();
    clearMemoryStore();
  });

  it("returns what was set and nothing after a delete", async () => {
    await memoryStore.set("greeting", "hello");
    expect(await memoryStore.get("greeting")).toBe("hello");
    await memoryStore.del("greeting");
    expect(await memoryStore.get("greeting")).toBeNull();
  });

  it("hides a value once its ttl has passed", async () => {
    vi.useFakeTimers();
    await memoryStore.set("token", "abc", 60);
    vi.advanceTimersByTime(59_000);
    expect(await memoryStore.get("token")).toBe("abc");
    vi.advanceTimersByTime(1_000);
    expect(await memoryStore.get("token")).toBeNull();
  });

  it("reads and deletes in one step", async () => {
    await memoryStore.set("once", "value");
    expect(await memoryStore.getAndDelete("once")).toBe("value");
    expect(await memoryStore.get("once")).toBeNull();
  });

  it("counts up without extending the first ttl, then starts over", async () => {
    vi.useFakeTimers();
    expect(await memoryStore.incr("hits", 10)).toBe(1);
    vi.advanceTimersByTime(9_000);
    expect(await memoryStore.incr("hits", 10, 2)).toBe(3);
    vi.advanceTimersByTime(1_000);
    expect(await memoryStore.incr("hits", 10)).toBe(1);
  });
});
