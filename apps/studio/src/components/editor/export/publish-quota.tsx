import { Button } from "@/components/ui/button";
import { Meter, MeterIndicator, MeterTrack } from "@/components/ui/meter";
import type { PublishQuota as Quota } from "@/hooks/use-publish";

type PublishQuotaProps = {
  quota: Quota;
  canUpgrade: boolean;
  onUpgrade: () => void;
};

function formatResetTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

function describeQuota({ dailyLimit, dailyRemaining, dailyResetsAt, liveLimit, liveRemaining }: Quota) {
  const daily = dailyLimit === null ? "" : `${dailyRemaining} of ${dailyLimit} left today`;
  const live = liveLimit === null ? "" : `${liveRemaining} of ${liveLimit} live`;
  const reset = dailyRemaining === 0 && dailyResetsAt ? `next at ${formatResetTime(dailyResetsAt)}` : "";
  return [daily, live, reset].filter(Boolean).join(" · ");
}

export default function PublishQuota({ quota, canUpgrade, onUpgrade }: PublishQuotaProps) {
  return (
    <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs tabular-nums sm:me-auto">
      {quota.dailyLimit !== null && (
        <Meter value={quota.dailyRemaining ?? 0} max={quota.dailyLimit} aria-label="Publishes left today" className="w-10">
          <MeterTrack className="h-1 rounded-full">
            <MeterIndicator className="rounded-full" />
          </MeterTrack>
        </Meter>
      )}
      <span>{describeQuota(quota)}</span>
      {canUpgrade && (
        <Button variant="link" size="xs" className="h-auto px-0" onClick={onUpgrade}>
          Upgrade
        </Button>
      )}
    </div>
  );
}
