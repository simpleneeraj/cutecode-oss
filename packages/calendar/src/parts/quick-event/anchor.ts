import { eventKey } from "../roving-focus/focus-key";

export function occurrenceElement(root: ParentNode | null, occurrenceKey: string): HTMLElement | null {
  const prefix = eventKey(occurrenceKey, "");
  const candidates = Array.from(root?.querySelectorAll<HTMLElement>("[data-focus-key]") ?? []);
  return candidates.find((element) => element.dataset.focusKey?.startsWith(prefix)) ?? null;
}
