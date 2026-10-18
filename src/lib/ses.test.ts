import { describe, it, expect, vi } from "vitest";
import { escapeHtml, sendResetPassword } from "./ses";

describe("ses", () => {
  it("escapes user-provided values", () => {
    expect(escapeHtml(`<a href="https://evil.test">'x'</a>&`)).toBe("&lt;a href=&quot;https://evil.test&quot;&gt;&#39;x&#39;&lt;/a&gt;&amp;");
  });

  it("logs reset links only in development", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const url = "https://app.test/reset?token=secret-token";
    vi.stubEnv("NODE_ENV", "production");
    await sendResetPassword({ user: { email: "u@test.app", name: "U" }, url });
    expect(JSON.stringify(info.mock.calls)).not.toContain("secret-token");
    vi.stubEnv("NODE_ENV", "development");
    await sendResetPassword({ user: { email: "u@test.app", name: "U" }, url });
    expect(JSON.stringify(info.mock.calls)).toContain("secret-token");
    vi.unstubAllEnvs();
    info.mockRestore();
  });
});
