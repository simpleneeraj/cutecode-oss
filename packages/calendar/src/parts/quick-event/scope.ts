import { z } from "zod";

import { isRecurring } from "../../event";
import type { ChangeProposal } from "../../drag";
import { ChangeScope, type EventOccurrence } from "../../types";
import type { QuickEventDraft } from "./target";

export enum ScopeRequestKind {
  Save = "save",
  Delete = "delete",
  Move = "move",
}

export type ScopeRequest =
  | { kind: ScopeRequestKind.Save; draft: QuickEventDraft }
  | { kind: ScopeRequestKind.Delete; occurrence: EventOccurrence }
  | { kind: ScopeRequestKind.Move; proposal: ChangeProposal };

export const scopeSchema = z.object({
  scope: z.enum(ChangeScope),
});

export type ScopeValues = z.infer<typeof scopeSchema>;

export const scopeDefaults: ScopeValues = {
  scope: ChangeScope.Following,
};

export const scopeOptions = [
  { scope: ChangeScope.This, label: "This event", detail: "Only this one changes." },
  { scope: ChangeScope.Following, label: "This and following", detail: "This one and every later one." },
  { scope: ChangeScope.All, label: "All events", detail: "Every event in the series." },
];

export const scopeCopy = {
  saveTitle: "Change a repeating event",
  deleteTitle: "Delete a repeating event",
  description: "Choose which events this applies to.",
  save: "Save",
  delete: "Delete",
};

export function needsScope(occurrence: EventOccurrence | null): boolean {
  return occurrence !== null && isRecurring(occurrence.event);
}

export function scopeDialogCopy(request: ScopeRequest) {
  const isDelete = request.kind === ScopeRequestKind.Delete;
  return { title: isDelete ? scopeCopy.deleteTitle : scopeCopy.saveTitle, description: scopeCopy.description };
}
