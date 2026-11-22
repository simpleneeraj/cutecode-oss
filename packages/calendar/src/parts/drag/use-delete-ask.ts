"use client";

import { useState } from "react";

import { AnnouncementKind, type Announcement, type ChangeScope, type EventOccurrence } from "../../types";
import { needsScope } from "../quick-event/scope";
import type { CalendarActions } from "../time-grid/props";

type DeleteRequest = {
  occurrence: EventOccurrence;
  onDeleted: () => void;
};

export function useDeleteAsk(onDelete: CalendarActions["onEventDelete"], announce: (announcement: Announcement) => void) {
  const [request, setRequest] = useState<DeleteRequest | null>(null);
  const remove = ({ occurrence, onDeleted }: DeleteRequest, scope?: ChangeScope) => {
    onDelete?.(occurrence, scope);
    announce({ kind: AnnouncementKind.Deleted, title: occurrence.event.title });
    onDeleted();
  };
  return {
    occurrence: request?.occurrence ?? null,
    canDelete: onDelete !== undefined,
    ask: (next: DeleteRequest) => (needsScope(next.occurrence) ? setRequest(next) : remove(next)),
    choose: (scope: ChangeScope) => {
      if (request !== null) {
        remove(request, scope);
      }
      setRequest(null);
    },
    cancel: () => setRequest(null),
  };
}

export type DeleteAsk = ReturnType<typeof useDeleteAsk>;
