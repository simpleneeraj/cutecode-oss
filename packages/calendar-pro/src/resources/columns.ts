import type { ColumnSource, EventOccurrence, Resource } from "@cutecode/calendar/types";

export function resourceColumns(resources: Resource[]): ColumnSource {
  return (dates) => {
    const hasResources = resources.length > 0;
    if (!hasResources) {
      return dates.map((date) => ({ key: date, date }));
    }
    return dates.flatMap((date) =>
      resources.map((resource) => ({ key: `${date}:${resource.id}`, date, resourceId: resource.id })),
    );
  };
}

export function occurrencesForResource(occurrences: EventOccurrence[], resourceId: string): EventOccurrence[] {
  return occurrences.filter((occurrence) => occurrence.event.resourceIds?.includes(resourceId) ?? false);
}
