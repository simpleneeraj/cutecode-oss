import { HugeiconsIcon } from "@hugeicons/react";
import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type PlanSlowNoticeProps = {
  isRefreshing: boolean;
  onRefresh: () => void;
};

export default function PlanSlowNotice({ isRefreshing, onRefresh }: PlanSlowNoticeProps) {
  return (
    <div className="flex flex-col items-center gap-4 border-t pt-8 text-muted-foreground text-sm">
      <p>
        Taking longer than usual. Refresh to check again, or email{" "}
        <a href="mailto:support@cutecode.app" className="text-foreground underline underline-offset-4">
          support@cutecode.app
        </a>{" "}
        if your plan doesn&apos;t appear.
      </p>
      <Button variant="outline" size="sm" disabled={isRefreshing} onClick={onRefresh}>
        {isRefreshing ? <Spinner aria-hidden="true" /> : <HugeiconsIcon icon={Refresh01Icon} aria-hidden="true" />}
        Refresh
      </Button>
    </div>
  );
}
