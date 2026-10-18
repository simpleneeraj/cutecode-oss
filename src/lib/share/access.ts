import { ShareVisibility } from "@/db/enums";

export type ShareAccess = "granted" | "not_found" | "passcode_required" | "verify_passcode";

type ShareAccessInput = {
  visibility: ShareVisibility;
  ownerId: string;
  viewerId: string | null | undefined;
  hasPasscodeHash: boolean;
  passcode: string | undefined;
  expired?: boolean;
};

type ShareLimits = {
  expiresAt: Date | null;
  maxViews: number | null;
  viewCount: number;
};

export function isShareExpired({ expiresAt }: Pick<ShareLimits, "expiresAt">, now = new Date()) {
  return !!expiresAt && expiresAt.getTime() <= now.getTime();
}

export function isShareExhausted({ maxViews, viewCount }: Pick<ShareLimits, "maxViews" | "viewCount">) {
  return maxViews !== null && viewCount >= maxViews;
}

export function resolveShareAccess({ visibility, ownerId, viewerId, hasPasscodeHash, passcode, expired = false }: ShareAccessInput): ShareAccess {
  if (viewerId && viewerId === ownerId) return "granted";
  if (expired) return "not_found";
  if (visibility === ShareVisibility.PRIVATE) return "not_found";
  if (visibility !== ShareVisibility.PASSCODE) return "granted";
  if (!hasPasscodeHash) return "not_found";
  return passcode ? "verify_passcode" : "passcode_required";
}

export function exposesShareDetails(link: { visibility: ShareVisibility } & ShareLimits) {
  if (isShareExpired(link) || isShareExhausted(link)) return false;
  return link.visibility === ShareVisibility.PUBLIC || link.visibility === ShareVisibility.UNLISTED;
}
