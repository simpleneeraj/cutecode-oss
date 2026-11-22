import { describe, expect, it } from "vitest";
import { TextDirection } from "../types";
import { KeyPlatform, platformOf, shortcutGroups } from "./shortcuts";

function rowOf(platform: KeyPlatform, label: string) {
  return shortcutGroups(platform)
    .flatMap((group) => group.rows)
    .find((row) => row.label === label);
}

describe("platformOf", () => {
  it("reads Apple platforms from the user agent", () => {
    expect(platformOf("Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0)")).toBe(KeyPlatform.Mac);
    expect(platformOf("Mozilla/5.0 (iPhone; CPU iPhone OS 19_0)")).toBe(KeyPlatform.Mac);
    expect(platformOf("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe(KeyPlatform.Other);
  });
});

describe("shortcutGroups", () => {
  it("lists every spec shortcut once per group", () => {
    const groups = shortcutGroups(KeyPlatform.Mac);
    expect(groups.map((group) => group.title)).toEqual(["Navigate", "Events", "Move with the keyboard", "General"]);
    expect(groups.flatMap((group) => group.rows)).toHaveLength(20);
  });

  it("uses Command glyphs on a Mac and Ctrl elsewhere", () => {
    expect(rowOf(KeyPlatform.Mac, "Undo")?.keys).toEqual(["⌘", "Z"]);
    expect(rowOf(KeyPlatform.Other, "Undo")?.keys).toEqual(["Ctrl", "Z"]);
    expect(rowOf(KeyPlatform.Other, "Drop")?.keys).toEqual(["Enter"]);
  });

  it("lists the previous key first in right to left layouts", () => {
    const rows = shortcutGroups(KeyPlatform.Mac, TextDirection.RightToLeft).flatMap((group) => group.rows);
    expect(rows.find((row) => row.label === "Previous or next day")?.keys).toEqual(["→", "←"]);
    expect(rows.find((row) => row.label === "Move a week")?.keys).toEqual(["⇧", "→", "←"]);
  });
});
