import { ResourceKind, type Resource } from "@cutecode/calendar/types";

const pickerLabels: Record<ResourceKind, string> = {
  [ResourceKind.Room]: "Rooms",
  [ResourceKind.Person]: "People",
  [ResourceKind.Equipment]: "Equipment",
};

const mixedLabel = "Resources";

export function selectedResourceOf(resources: Resource[], selectedId: string | null): Resource | null {
  return resources.find((resource) => resource.id === selectedId) ?? resources[0] ?? null;
}

export function shownResources(resources: Resource[], selected: Resource | null, isPhone: boolean): Resource[] {
  if (!isPhone || selected === null) {
    return resources;
  }
  return [selected];
}

export function pickerLabelOf(resources: Resource[]): string {
  const kinds = new Set(resources.map((resource) => resource.kind));
  const [kind] = kinds;
  return kinds.size === 1 && kind !== undefined ? pickerLabels[kind] : mixedLabel;
}
