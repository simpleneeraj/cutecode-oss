import { describe, expect, it } from "vitest";

import { makeEvent } from "../testing";
import { historyLimit, lastChange, recordChange, startHistory, undoChange, undoEntry } from "./history";

const first = [makeEvent()];
const second = [makeEvent({ title: "Moved" })];

describe("event history", () => {
  it("starts with nothing to undo", () => {
    const history = startHistory(first);
    expect(lastChange(history)).toBeNull();
    expect(undoChange(history)).toBe(history);
  });

  it("records the events before a change and restores them on undo", () => {
    const changed = recordChange(startHistory(first), "Move Design crit", second);
    expect(changed.events).toBe(second);
    expect(lastChange(changed)?.label).toBe("Move Design crit");
    const undone = undoChange(changed);
    expect(undone.events).toBe(first);
    expect(undone.past).toEqual([]);
  });

  it("keeps only the latest changes", () => {
    const labels = Array.from({ length: historyLimit + 5 }, (_, index) => `Change ${index}`);
    const history = labels.reduce((current, label) => recordChange(current, label, first), startHistory(first));
    expect(history.past).toHaveLength(historyLimit);
    expect(lastChange(history)?.label).toBe(`Change ${historyLimit + 4}`);
  });

  it("undoes an entry only while it is the newest change", () => {
    const deleted = recordChange(startHistory(first), "Delete event", []);
    const entry = lastChange(deleted);
    if (entry === null) {
      throw new Error("Expected an entry");
    }
    expect(undoEntry(deleted, entry).events).toBe(first);
    const later = recordChange(deleted, "Create event", second);
    expect(undoEntry(later, entry)).toBe(later);
  });
});
