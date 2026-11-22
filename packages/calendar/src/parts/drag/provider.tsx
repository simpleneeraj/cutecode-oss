"use client";

import { use, useMemo, type ReactNode } from "react";

import { ScopeAsk } from "../quick-event/scope-ask";
import { ScopeRequestKind, type ScopeRequest } from "../quick-event/scope";
import { DragContext, inertDragStore, type DragBinding } from "./context";
import { askedProposalOf, useDragState } from "./store";
import { dragHintStyles } from "./style";

function DragScopeAsk() {
  const drag = use(DragContext);
  const proposal = useDragState(drag?.store ?? inertDragStore, askedProposalOf);
  const request = useMemo<ScopeRequest | null>(
    () => (proposal === null ? null : { kind: ScopeRequestKind.Move, proposal }),
    [proposal],
  );
  if (drag === null) {
    return null;
  }
  return <ScopeAsk isSaving={false} onCancel={drag.scope.cancel} onChoose={drag.scope.choose} request={request} />;
}

function DeleteScopeAsk() {
  const drag = use(DragContext);
  const occurrence = drag?.deleteAsk.occurrence ?? null;
  const request = useMemo<ScopeRequest | null>(
    () => (occurrence === null ? null : { kind: ScopeRequestKind.Delete, occurrence }),
    [occurrence],
  );
  if (drag === null) {
    return null;
  }
  return <ScopeAsk isSaving={false} onCancel={drag.deleteAsk.cancel} onChoose={drag.deleteAsk.choose} request={request} />;
}

type DragProviderProps = {
  value: DragBinding;
  children: ReactNode;
};

const hintCopy = {
  move: "Press Space to pick it up, arrows to move it by 15 minutes or a day, Return to drop, Escape to cancel.",
};

const styles = dragHintStyles();

function DragProvider({ value, children }: DragProviderProps) {
  return (
    <DragContext value={value}>
      {children}
      {value.moveHintId !== null && (
        <span className={styles} id={value.moveHintId}>
          {hintCopy.move}
        </span>
      )}
      <DragScopeAsk />
      <DeleteScopeAsk />
    </DragContext>
  );
}

export { DragProvider };
