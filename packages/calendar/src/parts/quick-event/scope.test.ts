import { describe, expect, it } from "vitest";

import { occurrenceOf } from "../../event";
import { makeEvent, makeOccurrence } from "../../testing";
import { ChangeScope, ChangeSource, Frequency } from "../../types";
import { ScopeRequestKind, needsScope, scopeDefaults, scopeDialogCopy, scopeSchema } from "./scope";

describe("change scope", () => {
  it("asks only for repeating events", () => {
    expect(needsScope(null)).toBe(false);
    expect(needsScope(makeOccurrence())).toBe(false);
    const weekly = makeEvent({ id: "standup", recurrence: { frequency: Frequency.Weekly, interval: 1 } });
    expect(needsScope(occurrenceOf(weekly))).toBe(true);
    expect(needsScope(occurrenceOf(makeEvent({ id: "moved", seriesId: "standup" })))).toBe(true);
  });

  it("defaults to this and following and accepts only known scopes", () => {
    expect(scopeDefaults.scope).toBe(ChangeScope.Following);
    expect(scopeSchema.safeParse({ scope: ChangeScope.All }).success).toBe(true);
    expect(scopeSchema.safeParse({ scope: "every" }).success).toBe(false);
  });

  it("titles the ask by what it does", () => {
    const occurrence = makeOccurrence();
    expect(scopeDialogCopy({ kind: ScopeRequestKind.Delete, occurrence }).title).toBe("Delete a repeating event");
    const draft = {
      calendarId: "work",
      title: "Crit",
      start: "",
      end: "",
      allDay: false,
      timeZone: "UTC",
      source: ChangeSource.Form,
    };
    expect(scopeDialogCopy({ kind: ScopeRequestKind.Save, draft }).title).toBe("Change a repeating event");
  });
});
