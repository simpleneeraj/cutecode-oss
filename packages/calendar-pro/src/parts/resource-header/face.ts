import { ResourceKind, type Resource } from "@cutecode/calendar/types";

export enum ResourceFace {
  Room = "room",
  Equipment = "equipment",
  Initials = "initials",
}

const faces: Record<ResourceKind, ResourceFace> = {
  [ResourceKind.Room]: ResourceFace.Room,
  [ResourceKind.Equipment]: ResourceFace.Equipment,
  [ResourceKind.Person]: ResourceFace.Initials,
};

const detailCopy = {
  seats: (count: number) => (count === 1 ? "1 seat" : `${count} seats`),
};

export function faceOf(resource: Resource): ResourceFace {
  return faces[resource.kind];
}

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter((word) => word.length > 0);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toLocaleUpperCase();
}

export function detailOf(resource: Resource): string | null {
  if (resource.detail !== undefined) {
    return resource.detail;
  }
  return resource.capacity === undefined ? null : detailCopy.seats(resource.capacity);
}

export function headerLabel(resource: Resource): string {
  const detail = detailOf(resource);
  return detail === null ? resource.name : `${resource.name}, ${detail}`;
}
