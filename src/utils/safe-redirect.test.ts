import { describe, it, expect } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it.each(["/", "/dashboard", "/preview/abc?tab=code#top", "/?upgrade=true"])("keeps same-origin path %s", (path) => {
    expect(safeRedirectPath(path)).toBe(path);
  });

  it.each([
    null,
    "",
    "https://evil.test/login",
    "//evil.test/login",
    "/\\evil.test",
    "\\\\evil.test",
    "javascript:alert(1)",
    "/\t/evil.test",
    "dashboard",
  ])("falls back for %j", (value) => {
    expect(safeRedirectPath(value)).toBe("/");
  });
});
