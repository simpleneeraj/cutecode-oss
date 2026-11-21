import { describe, expect, it } from "vitest";
import { KeyboardMode, KeyCommand, TextDirection, type KeyInput } from "../types";
import { commandFor } from "./commands";

function press(key: string, modifiers: Partial<KeyInput> = {}): KeyInput {
  return { key, shiftKey: false, metaKey: false, ctrlKey: false, altKey: false, ...modifiers };
}

const browse = (input: KeyInput, direction = TextDirection.LeftToRight) =>
  commandFor(input, KeyboardMode.Browse, direction);
const carrying = (input: KeyInput, direction = TextDirection.LeftToRight) =>
  commandFor(input, KeyboardMode.Carrying, direction);

describe("commandFor, browse", () => {
  it("maps the spec letters", () => {
    const letters = ["t", "d", "w", "m", "y", "a", "n"].map((key) => browse(press(key)));
    expect(letters).toEqual([
      KeyCommand.Today,
      KeyCommand.ShowDay,
      KeyCommand.ShowWeek,
      KeyCommand.ShowMonth,
      KeyCommand.ShowYear,
      KeyCommand.ShowAgenda,
      KeyCommand.NewEvent,
    ]);
  });

  it("ignores letter case", () => {
    expect(browse(press("T"))).toBe(KeyCommand.Today);
  });

  it("maps arrows to days and hours", () => {
    expect(browse(press("ArrowLeft"))).toBe(KeyCommand.PreviousDay);
    expect(browse(press("ArrowRight"))).toBe(KeyCommand.NextDay);
    expect(browse(press("ArrowUp"))).toBe(KeyCommand.PreviousHour);
    expect(browse(press("ArrowDown"))).toBe(KeyCommand.NextHour);
  });

  it("maps Shift with Left and Right to weeks", () => {
    expect(browse(press("ArrowLeft", { shiftKey: true }))).toBe(KeyCommand.PreviousWeek);
    expect(browse(press("ArrowRight", { shiftKey: true }))).toBe(KeyCommand.NextWeek);
  });

  it("mirrors Left and Right in right to left", () => {
    const rightToLeft = TextDirection.RightToLeft;
    expect(browse(press("ArrowLeft"), rightToLeft)).toBe(KeyCommand.NextDay);
    expect(browse(press("ArrowRight"), rightToLeft)).toBe(KeyCommand.PreviousDay);
    expect(browse(press("ArrowLeft", { shiftKey: true }), rightToLeft)).toBe(KeyCommand.NextWeek);
    expect(browse(press("ArrowRight", { shiftKey: true }), rightToLeft)).toBe(KeyCommand.PreviousWeek);
  });

  it("does not mirror Up and Down", () => {
    expect(browse(press("ArrowUp"), TextDirection.RightToLeft)).toBe(KeyCommand.PreviousHour);
  });

  it("maps Return, Delete, Backspace, Space, slash, question mark and Escape", () => {
    expect(browse(press("Enter"))).toBe(KeyCommand.OpenEvent);
    expect(browse(press("Delete"))).toBe(KeyCommand.DeleteEvent);
    expect(browse(press("Backspace"))).toBe(KeyCommand.DeleteEvent);
    expect(browse(press(" "))).toBe(KeyCommand.PickUp);
    expect(browse(press("/"))).toBe(KeyCommand.Search);
    expect(browse(press("?", { shiftKey: true }))).toBe(KeyCommand.ShowShortcuts);
    expect(browse(press("Escape"))).toBe(KeyCommand.Cancel);
  });

  it("maps Command or Control with D and K", () => {
    expect(browse(press("d", { metaKey: true }))).toBe(KeyCommand.DuplicateEvent);
    expect(browse(press("d", { ctrlKey: true }))).toBe(KeyCommand.DuplicateEvent);
    expect(browse(press("k", { metaKey: true }))).toBe(KeyCommand.QuickAdd);
    expect(browse(press("K", { ctrlKey: true }))).toBe(KeyCommand.QuickAdd);
  });

  it("leaves other Command shortcuts to the browser", () => {
    expect(browse(press("t", { metaKey: true }))).toBeNull();
    expect(browse(press("ArrowLeft", { metaKey: true }))).toBeNull();
    expect(browse(press("d", { metaKey: true, shiftKey: true }))).toBeNull();
  });

  it("ignores Option and unknown keys", () => {
    expect(browse(press("d", { altKey: true }))).toBeNull();
    expect(browse(press("q"))).toBeNull();
    expect(browse(press("Tab"))).toBeNull();
  });
});

describe("commandFor, carrying", () => {
  it("nudges with arrows", () => {
    expect(carrying(press("ArrowUp"))).toBe(KeyCommand.PreviousHour);
    expect(carrying(press("ArrowDown"))).toBe(KeyCommand.NextHour);
    expect(carrying(press("ArrowRight"))).toBe(KeyCommand.NextDay);
    expect(carrying(press("ArrowLeft"), TextDirection.RightToLeft)).toBe(KeyCommand.NextDay);
  });

  it("drops on Return and cancels on Escape", () => {
    expect(carrying(press("Enter"))).toBe(KeyCommand.Drop);
    expect(carrying(press("Escape"))).toBe(KeyCommand.Cancel);
  });

  it("ignores view letters, delete and Command shortcuts while carrying", () => {
    expect(carrying(press("w"))).toBeNull();
    expect(carrying(press("Delete"))).toBeNull();
    expect(carrying(press(" "))).toBeNull();
    expect(carrying(press("d", { metaKey: true }))).toBeNull();
  });
});
