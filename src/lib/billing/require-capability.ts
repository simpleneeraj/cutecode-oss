import { TRPCError } from "@trpc/server";
import { Plan, ShareVisibility } from "@/db/enums";
import { can, type Capability } from "@/lib/billing/plans";

const RESTRICTED_VISIBILITIES = new Set<ShareVisibility>([ShareVisibility.PASSCODE, ShareVisibility.PRIVATE]);

export function requireCapability(plan: Plan, capability: Capability) {
  if (can(plan, capability)) return;
  throw new TRPCError({
    code: "FORBIDDEN",
    message: `Your plan does not include ${capability}. Upgrade to unlock it.`,
  });
}

export function requireShareVisibility(plan: Plan, visibility: ShareVisibility | undefined) {
  if (!visibility || !RESTRICTED_VISIBILITIES.has(visibility)) return;
  requireCapability(plan, "privateShares");
}
