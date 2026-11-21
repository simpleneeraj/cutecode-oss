import { Spinner } from "@/components/ui/spinner";
import PlanSlowNotice from "./plan-slow-notice";

type PlanActivatingProps = {
  isSlow: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export default function PlanActivating({ isSlow, isRefreshing, onRefresh }: PlanActivatingProps) {
  return (
    <div className="flex max-w-sm flex-col items-center gap-8 text-center">
      <div role="status" className="flex flex-col items-center gap-4">
        <Spinner aria-hidden="true" className="size-6 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <h1 className="font-heading font-semibold text-xl">Activating your plan…</h1>
          <p className="text-muted-foreground text-sm">This usually takes a few seconds. Keep this tab open.</p>
        </div>
      </div>
      {isSlow && <PlanSlowNotice isRefreshing={isRefreshing} onRefresh={onRefresh} />}
    </div>
  );
}
