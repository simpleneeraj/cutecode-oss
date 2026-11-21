import { describe, expect, it, vi } from "vitest";
import { loadQuickAddParser } from "./index";

const loads = vi.hoisted(() => ({ count: 0 }));

vi.mock("chrono-node/en", async (importActual) => {
  loads.count += 1;
  return importActual();
});

describe("quick add loading", () => {
  it("loads chrono-node only when the parser is requested", async () => {
    expect(loads.count).toBe(0);
    const parse = await loadQuickAddParser();
    expect(loads.count).toBe(1);
    expect(typeof parse).toBe("function");
  });
});
