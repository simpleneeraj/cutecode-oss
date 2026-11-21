export type FolderPeek = {
  isHovered: boolean;
  isTapped: boolean;
};

export const closedPeek: FolderPeek = { isHovered: false, isTapped: false };

export function isFolderOpen(peek: FolderPeek) {
  return peek.isHovered || peek.isTapped;
}

export function mergePeek(current: FolderPeek, change: Partial<FolderPeek>) {
  const next = { ...current, ...change };
  const isUnchanged = next.isHovered === current.isHovered && next.isTapped === current.isTapped;
  return isUnchanged ? current : next;
}

export function tapPeek(current: FolderPeek) {
  return mergePeek(current, { isTapped: !isFolderOpen(current) });
}
