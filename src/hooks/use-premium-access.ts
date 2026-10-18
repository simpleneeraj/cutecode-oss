import { useSetAtom } from "jotai";
import { AccessLevel } from "@/typings/enums";
import { useUser } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { limit as planLimit, type Capability, type NumericCapability } from "@/lib/billing/plans";
import { Plan } from "@/db/schema";
import { plansDialogOpenAtom } from "@/store/editor/plans";

export function usePremiumAccess() {
  const { isSignedIn, isLoaded } = useUser();
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);
  const { can, limit, isLoaded: subLoaded } = useSubscription();

  const isReady = isLoaded && subLoaded;

  const resolveAccess = (isGated: boolean, isAllowed: boolean): AccessLevel => {
    if (!isGated) return AccessLevel.ALLOWED;
    if (!isReady) return AccessLevel.LOADING;
    if (!isSignedIn) return AccessLevel.REQUIRES_AUTH;
    if (!isAllowed) return AccessLevel.REQUIRES_UPGRADE;
    return AccessLevel.ALLOWED;
  };

  const checkAccess = (capability: Capability, isGated = true) => resolveAccess(isGated, can(capability));

  const checkLimit = (capability: NumericCapability, value: number) =>
    resolveAccess(value > planLimit(Plan.FREE, capability), value <= limit(capability));

  const withAccess = (access: AccessLevel, onAllowed: () => void) => {
    switch (access) {
      case AccessLevel.ALLOWED:
        onAllowed();
        break;
      case AccessLevel.REQUIRES_AUTH:
      case AccessLevel.REQUIRES_UPGRADE:
        setPlansOpen(true);
        break;
      case AccessLevel.LOADING:
        break;
    }
  };

  return {
    checkAccess,
    checkLimit,
    withAccess,
  };
}
