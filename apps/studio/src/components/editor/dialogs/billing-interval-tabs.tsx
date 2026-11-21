import { Badge } from "@cutecode/ui/components/badge";
import { Tabs, TabsList, TabsTab } from "@cutecode/ui/components/tabs";
import { BillingInterval } from "@/lib/billing/products";

const INTERVALS = Object.values(BillingInterval);

type BillingIntervalTabsProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
};

export default function BillingIntervalTabs({ value, onChange }: BillingIntervalTabsProps) {
  function onValueChange(next: unknown) {
    const interval = INTERVALS.find((option) => option === next);
    if (interval) onChange(interval);
  }

  return (
    <Tabs value={value} onValueChange={onValueChange} className="self-center">
      <TabsList>
        <TabsTab value={BillingInterval.MONTHLY}>Monthly</TabsTab>
        <TabsTab value={BillingInterval.YEARLY}>
          Yearly
          <Badge variant="success" size="sm">
            2 months free
          </Badge>
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
