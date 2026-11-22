import { KeyboardMode, KeyCommand, TextDirection, type KeyInput } from "../types";

type ArrowCommands = { plain: KeyCommand; shifted: KeyCommand };

const keys = {
  arrowLeft: "arrowleft",
  arrowRight: "arrowright",
  arrowUp: "arrowup",
  arrowDown: "arrowdown",
  enter: "enter",
  escape: "escape",
  space: " ",
};

const backward: ArrowCommands = { plain: KeyCommand.PreviousDay, shifted: KeyCommand.PreviousWeek };
const forward: ArrowCommands = { plain: KeyCommand.NextDay, shifted: KeyCommand.NextWeek };

const verticalCommands: Record<string, KeyCommand> = {
  [keys.arrowUp]: KeyCommand.PreviousHour,
  [keys.arrowDown]: KeyCommand.NextHour,
};

const plainCommands: Record<string, KeyCommand> = {
  t: KeyCommand.Today,
  d: KeyCommand.ShowDay,
  w: KeyCommand.ShowWeek,
  m: KeyCommand.ShowMonth,
  y: KeyCommand.ShowYear,
  a: KeyCommand.ShowAgenda,
  n: KeyCommand.NewEvent,
  [keys.enter]: KeyCommand.OpenEvent,
  delete: KeyCommand.DeleteEvent,
  backspace: KeyCommand.DeleteEvent,
  [keys.space]: KeyCommand.PickUp,
  "/": KeyCommand.Search,
  "?": KeyCommand.ShowShortcuts,
  [keys.escape]: KeyCommand.Cancel,
};

const modifiedCommands: Record<string, KeyCommand> = {
  d: KeyCommand.DuplicateEvent,
  k: KeyCommand.QuickAdd,
  z: KeyCommand.Undo,
};

const carryingCommands: Record<string, KeyCommand> = {
  [keys.enter]: KeyCommand.Drop,
  [keys.escape]: KeyCommand.Cancel,
};

function horizontalCommands(key: string, direction: TextDirection): ArrowCommands | undefined {
  const isRightToLeft = direction === TextDirection.RightToLeft;
  if (key === keys.arrowLeft) {
    return isRightToLeft ? forward : backward;
  }
  if (key === keys.arrowRight) {
    return isRightToLeft ? backward : forward;
  }
  return undefined;
}

function arrowCommand(key: string, shiftKey: boolean, direction: TextDirection): KeyCommand | undefined {
  const horizontal = horizontalCommands(key, direction);
  if (horizontal) {
    return shiftKey ? horizontal.shifted : horizontal.plain;
  }
  return verticalCommands[key];
}

function commandKeyCommand(key: string, input: KeyInput, mode: KeyboardMode): KeyCommand | null {
  const isPlainCommandKey = mode === KeyboardMode.Browse && !input.shiftKey;
  if (!isPlainCommandKey) {
    return null;
  }
  return modifiedCommands[key] ?? null;
}

export function commandFor(input: KeyInput, mode: KeyboardMode, direction: TextDirection): KeyCommand | null {
  const key = input.key.toLowerCase();
  if (input.altKey) {
    return null;
  }
  const isCommandKey = input.metaKey || input.ctrlKey;
  if (isCommandKey) {
    return commandKeyCommand(key, input, mode);
  }
  const arrow = arrowCommand(key, input.shiftKey, direction);
  if (arrow) {
    return arrow;
  }
  const commands = mode === KeyboardMode.Carrying ? carryingCommands : plainCommands;
  return commands[key] ?? null;
}
