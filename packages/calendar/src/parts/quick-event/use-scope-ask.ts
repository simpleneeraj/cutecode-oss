"use client";

import { useState } from "react";

import type { ChangeScope, EventOccurrence } from "../../types";
import { ScopeRequestKind, needsScope, type ScopeRequest } from "./scope";
import type { QuickEventActions } from "./target";

export function useScopeAsk(actions: QuickEventActions, occurrence: EventOccurrence | null) {
  const [request, setRequest] = useState<ScopeRequest | null>(null);
  const isRepeating = needsScope(occurrence);

  const askingActions: QuickEventActions = {
    onSave: (draft) => (isRepeating ? setRequest({ kind: ScopeRequestKind.Save, draft }) : actions.onSave(draft)),
    onDelete: (target) =>
      isRepeating ? setRequest({ kind: ScopeRequestKind.Delete, occurrence: target }) : actions.onDelete(target),
  };

  const choose = (scope: ChangeScope) => {
    if (request?.kind === ScopeRequestKind.Save) {
      actions.onSave({ ...request.draft, scope });
    }
    if (request?.kind === ScopeRequestKind.Delete) {
      actions.onDelete(request.occurrence, scope);
    }
    setRequest(null);
  };

  return { actions: askingActions, request, choose, cancel: () => setRequest(null) };
}

export type ScopeAskState = ReturnType<typeof useScopeAsk>;
