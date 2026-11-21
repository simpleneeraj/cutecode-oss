import { useAtomValue, useSetAtom } from "jotai";
import { Badge } from "@cutecode/ui/components/badge";
import { CrownIcon } from "@solar-icons/react/bold/crown";
import { Select, SelectItem, SelectPopup, SelectTrigger } from "@cutecode/ui/components/select";
import { useSubscription } from "@/hooks/use-subscription";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { dispatchPublishSnippetAtom, publishSnippetAtom } from "./store";
import { Visibility } from "./types";
import { VISIBILITY_ORDER, visibilityConfig } from "./visibility-config";

function isVisibility(value: unknown): value is Visibility {
  return Object.values(Visibility).some((visibility) => visibility === value);
}

export default function VisibilitySelect() {
  const { visibility } = useAtomValue(publishSnippetAtom);
  const dispatch = useSetAtom(dispatchPublishSnippetAtom);
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);
  const { can } = useSubscription();
  const canUsePrivateShares = can("privateShares");
  const current = visibilityConfig[visibility];

  const onValueChange = (value: unknown) => {
    if (!isVisibility(value)) return;
    if (visibilityConfig[value].isPremium && !canUsePrivateShares) {
      setPlansOpen(true);
      return;
    }
    dispatch({ visibility: value });
  };

  return (
    <Select value={visibility} onValueChange={onValueChange}>
      <SelectTrigger>
        <span className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-muted">
            <current.icon className="size-3 text-foreground" />
          </span>
          {current.label}
        </span>
      </SelectTrigger>
      <SelectPopup>
        {VISIBILITY_ORDER.map((value) => {
          const config = visibilityConfig[value];
          const isLocked = config.isPremium && !canUsePrivateShares;
          return (
            <SelectItem key={value} value={value}>
              <span className="flex w-full items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
                  <config.icon className="size-3.5 text-muted-foreground" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium leading-none">{config.label}</span>
                  <span className="mt-0.5 text-xs text-muted-foreground">{config.sub}</span>
                </span>
                {isLocked && (
                  <Badge variant="outline" className="ml-auto gap-1">
                    <CrownIcon className="size-3" />
                    Premium
                  </Badge>
                )}
              </span>
            </SelectItem>
          );
        })}
      </SelectPopup>
    </Select>
  );
}
