import { instantAt, makeSettings } from "@cutecode/calendar/testing";
import type { QuickAddContext, QuickAddParser } from "@cutecode/calendar/types";
import { beforeAll, describe, expect, it } from "vitest";

import { loadQuickAddParser } from "../../quick-add";
import { HintKind, hintOf } from "./hint";

let parse: QuickAddParser;

beforeAll(async () => {
  parse = await loadQuickAddParser();
});

const settings = makeSettings();

const context: QuickAddContext = { now: instantAt("2026-10-28", "10:00"), settings, calendarId: "work" };

function hintFor(text: string) {
  return hintOf({ text, result: parse(text, context), hasFailed: false, settings });
}

describe("quick add hints", () => {
  it("shows an example when empty and waits while the parser loads", () => {
    expect(hintOf({ text: " ", result: null, hasFailed: false, settings }).kind).toBe(HintKind.Example);
    expect(hintOf({ text: "Lunch", result: null, hasFailed: false, settings }).kind).toBe(HintKind.Loading);
    expect(hintOf({ text: "Lunch", result: null, hasFailed: true, settings }).kind).toBe(HintKind.Failed);
  });

  it("says where an event goes when the day or time is missing", () => {
    expect(hintFor("Lunch").kind).toBe(HintKind.MissingDayAndTime);
    expect(hintFor("Lunch Fri").kind).toBe(HintKind.MissingTime);
    expect(hintFor("Lunch 1pm")).toEqual({ kind: HintKind.MissingDay, text: "No day found. It goes on Wed, Oct 28." });
    expect(hintFor("Lunch 9am").text).toBe("No day found. It goes on Thu, Oct 29.");
  });

  it("asks for a title and is ready once everything is there", () => {
    expect(hintFor("tomorrow 9am").kind).toBe(HintKind.MissingTitle);
    expect(hintFor("Lunch with Ana Fri 1pm").kind).toBe(HintKind.Ready);
  });

  it("keeps unknown words in the title", () => {
    expect(parse("Blorp zazzle Fri 1pm", context).draft?.title).toBe("Blorp zazzle");
    expect(hintFor("Blorp zazzle Fri 1pm").kind).toBe(HintKind.Ready);
  });
});
