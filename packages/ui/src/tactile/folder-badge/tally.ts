export enum RollDirection {
  Up = "up",
  Down = "down",
}

const maximumShown = 99;

export function formatBadgeValue(value: number) {
  return value > maximumShown ? `${maximumShown}+` : String(value);
}

export function readRollDirection(previous: number, next: number) {
  return next < previous ? RollDirection.Down : RollDirection.Up;
}
