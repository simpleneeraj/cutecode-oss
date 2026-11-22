import { eventKey } from "../roving-focus/focus-key";

export function occurrenceElement(root: ParentNode | null, occurrenceKey: string): HTMLElement | null {
  const prefix = eventKey(occurrenceKey, "");
  const candidates = Array.from(root?.querySelectorAll<HTMLElement>("[data-focus-key]") ?? []);
  const matches = candidates.filter((element) => element.dataset.focusKey?.startsWith(prefix));
  const focused = matches.find((element) => element === element.ownerDocument.activeElement);
  return focused ?? matches[0] ?? null;
}
