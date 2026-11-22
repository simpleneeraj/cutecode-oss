export enum InviteeKey {
  Add = "add",
  RemoveLast = "removeLast",
  None = "none",
}

const addKeys = ["Enter", ","];

export function withInvitee(invitees: string[], entry: string): string[] {
  const name = entry.trim();
  const isNew = name !== "" && !invitees.includes(name);
  return isNew ? [...invitees, name] : invitees;
}

export function inviteeKeyOf(key: string, entry: string): InviteeKey {
  const hasEntry = entry.trim() !== "";
  if (hasEntry && addKeys.includes(key)) {
    return InviteeKey.Add;
  }
  const isRemove = key === "Backspace" && entry === "";
  return isRemove ? InviteeKey.RemoveLast : InviteeKey.None;
}
