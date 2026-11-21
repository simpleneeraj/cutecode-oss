import { describe, it, expect } from "vitest";
import { ShareVisibility } from "@/db/enums";
import { exposesShareDetails, resolveShareAccess } from "./access";

const base = { ownerId: "owner", viewerId: null, hasPasscodeHash: false, passcode: undefined };

describe("share/access", () => {
  it("grants public and unlisted links to anyone", () => {
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.PUBLIC })).toBe("granted");
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.UNLISTED })).toBe("granted");
  });

  it("hides private links from everyone but the owner", () => {
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.PRIVATE })).toBe("not_found");
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.PRIVATE, viewerId: "someone" })).toBe("not_found");
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.PRIVATE, viewerId: "owner" })).toBe("granted");
  });

  it("asks for a passcode, then verifies it", () => {
    const passcodeLink = { ...base, visibility: ShareVisibility.PASSCODE, hasPasscodeHash: true };
    expect(resolveShareAccess(passcodeLink)).toBe("passcode_required");
    expect(resolveShareAccess({ ...passcodeLink, passcode: "123456" })).toBe("verify_passcode");
    expect(resolveShareAccess({ ...passcodeLink, viewerId: "owner" })).toBe("granted");
  });

  it("never opens a passcode link that has no passcode set", () => {
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.PASSCODE, passcode: "123456" })).toBe("not_found");
  });

  it("hides expired links from everyone but the owner", () => {
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.PUBLIC, expired: true })).toBe("not_found");
    expect(resolveShareAccess({ ...base, visibility: ShareVisibility.PUBLIC, expired: true, viewerId: "owner" })).toBe("granted");
  });

  it("exposes titles only for live public and unlisted links", () => {
    const live = { expiresAt: null, maxViews: null, viewCount: 0 };
    expect(exposesShareDetails({ ...live, visibility: ShareVisibility.PUBLIC })).toBe(true);
    expect(exposesShareDetails({ ...live, visibility: ShareVisibility.UNLISTED })).toBe(true);
    expect(exposesShareDetails({ ...live, visibility: ShareVisibility.PASSCODE })).toBe(false);
    expect(exposesShareDetails({ ...live, visibility: ShareVisibility.PRIVATE })).toBe(false);
    expect(exposesShareDetails({ ...live, visibility: ShareVisibility.PUBLIC, expiresAt: new Date(Date.now() - 1000) })).toBe(false);
    expect(exposesShareDetails({ ...live, visibility: ShareVisibility.PUBLIC, maxViews: 3, viewCount: 3 })).toBe(false);
  });
});
