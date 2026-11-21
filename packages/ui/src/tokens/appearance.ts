export enum Appearance {
  Light = "light",
  Dark = "dark",
}

export type AppearanceValue = Record<Appearance, string>;

export type TokenValue = string | AppearanceValue;

export function readValue(value: TokenValue, appearance: Appearance) {
  if (typeof value === "string") {
    return value;
  }
  return value[appearance];
}
