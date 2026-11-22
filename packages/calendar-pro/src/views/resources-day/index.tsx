"use client";

import type { CalendarViewProps } from "@cutecode/calendar/day";
import { ColumnHeaderContext } from "@cutecode/calendar/parts/time-grid/column-header";
import type { GridColumn } from "@cutecode/calendar/parts/time-grid/columns";
import { TimeGridView } from "@cutecode/calendar/parts/time-grid/view";
import { useIsPhone } from "@cutecode/calendar/parts/viewport/use-is-phone";
import { ViewKind, type DropConstraint, type Resource } from "@cutecode/calendar/types";
import { useMemo, useState } from "react";

import { ResourceHeader } from "../../parts/resource-header";
import { ResourcePicker } from "../../parts/resource-picker";
import { bookableHoursConstraint } from "../../resources/bookable";
import { resourceColumns } from "../../resources/columns";
import { pickerLabelOf, selectedResourceOf, shownResources } from "./shown";
import { resourcesDayStyles } from "./style";

const resourceConstraints: DropConstraint[] = [bookableHoursConstraint];

const noResources: Resource[] = [];

const styles = resourcesDayStyles();

function useResourcesDay(props: CalendarViewProps) {
  const resources = props.data.resources ?? noResources;
  const isPhone = useIsPhone();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const selected = selectedResourceOf(resources, pickedId);
  const columns = useMemo(
    () => resourceColumns(shownResources(resources, selected, isPhone)),
    [resources, selected, isPhone],
  );
  const constraints = [...(props.data.constraints ?? []), ...resourceConstraints];
  const calendar: CalendarViewProps = { ...props, data: { ...props.data, resources, columns, constraints } };

  return {
    calendar,
    picker: {
      isShown: isPhone && resources.length > 1,
      label: pickerLabelOf(resources),
      resources,
      value: selected?.id ?? null,
      onValueChange: setPickedId,
    },
  };
}

function renderResourceHeader(column: GridColumn) {
  return <ResourceHeader column={column} />;
}

function ResourcesDayView(props: CalendarViewProps) {
  const { calendar, picker } = useResourcesDay(props);

  return (
    <div className={styles.root()} data-slot="resources-day-view">
      {picker.isShown && (
        <ResourcePicker
          label={picker.label}
          onValueChange={picker.onValueChange}
          resources={picker.resources}
          value={picker.value}
        />
      )}
      <ColumnHeaderContext value={renderResourceHeader}>
        <TimeGridView calendar={calendar} kind={ViewKind.Day} />
      </ColumnHeaderContext>
    </div>
  );
}

export { ResourcesDayView };
export type { CalendarViewProps as ResourcesDayProps } from "@cutecode/calendar/day";
