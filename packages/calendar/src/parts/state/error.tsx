"use client";

import { DangerCircleIcon } from "@solar-icons/react/linear/danger-circle";
import { RestartIcon } from "@solar-icons/react/linear/restart";
import { Button } from "@cutecode/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@cutecode/ui/components/empty";

import { stateCopy } from "./copy";

type CalendarErrorProps = {
  onRetry: () => void;
  title?: string;
  description?: string;
};

function CalendarError({
  onRetry,
  title = stateCopy.errorTitle,
  description = stateCopy.errorDescription,
}: CalendarErrorProps) {
  return (
    <Empty data-slot="calendar-error" role="alert">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <DangerCircleIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onRetry} variant="outline">
          <RestartIcon aria-hidden="true" />
          {stateCopy.retry}
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export { CalendarError };
