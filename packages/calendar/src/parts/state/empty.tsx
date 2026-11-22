import { CalendarMinimalisticIcon } from "@solar-icons/react/linear/calendar-minimalistic";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

import { stateCopy } from "./copy";

type CalendarEmptyProps = {
  title?: string;
  description?: string;
};

function CalendarEmpty({ title = stateCopy.emptyTitle, description = stateCopy.emptyDescription }: CalendarEmptyProps) {
  return (
    <Empty data-slot="calendar-empty">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarMinimalisticIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export { CalendarEmpty };
