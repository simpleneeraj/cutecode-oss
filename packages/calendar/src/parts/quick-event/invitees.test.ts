import { describe, expect, it } from "vitest";

import { InviteeKey, inviteeKeyOf, withInvitee } from "./invitees";

describe("invitees", () => {
  it("adds a trimmed new name once", () => {
    expect(withInvitee(["Maya"], " Leo ")).toEqual(["Maya", "Leo"]);
    expect(withInvitee(["Maya"], "Maya")).toEqual(["Maya"]);
    expect(withInvitee(["Maya"], "  ")).toEqual(["Maya"]);
  });

  it("maps keys to what they do", () => {
    expect(inviteeKeyOf("Enter", "Leo")).toBe(InviteeKey.Add);
    expect(inviteeKeyOf(",", "Leo")).toBe(InviteeKey.Add);
    expect(inviteeKeyOf("Enter", " ")).toBe(InviteeKey.None);
    expect(inviteeKeyOf("Backspace", "")).toBe(InviteeKey.RemoveLast);
    expect(inviteeKeyOf("Backspace", "L")).toBe(InviteeKey.None);
  });
});
