import { expect, it } from "vitest";
import {
  defaultStyleSettings,
  FontPairing,
  Palette,
  pickStyleSettings,
  readStyleSettings,
  serializeStyleSettings,
  Style,
} from ".";

it("reads defaults when the cookie is missing", () => {
  expect(readStyleSettings(undefined)).toEqual(defaultStyleSettings);
});

it("reads a stored cookie value", () => {
  expect(readStyleSettings("pop.teal.pop")).toEqual({
    style: Style.Pop,
    palette: Palette.Teal,
    font: FontPairing.Pop,
  });
});

it("falls back per field on unknown values", () => {
  expect(readStyleSettings("paper.neon")).toEqual({ ...defaultStyleSettings, style: Style.Paper });
});

it("round trips through serialize", () => {
  const settings = { style: Style.Clay, palette: Palette.Graphite, font: FontPairing.Rounded };
  expect(readStyleSettings(serializeStyleSettings(settings))).toEqual(settings);
});

it("picks known values and keeps the fallback for the rest", () => {
  const fallback = { style: Style.Paper, palette: Palette.Pink, font: FontPairing.Editorial };
  expect(pickStyleSettings({ style: "pop", palette: ["teal"], font: "neon" }, fallback)).toEqual({
    ...fallback,
    style: Style.Pop,
  });
});
