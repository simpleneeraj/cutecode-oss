import { Input } from "@cutecode/ui/components/input";
import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";

import { HomeTabBar } from "@/components/home/home-tab-bar";

import { billingPeriods } from "./demo-data";
import { partsGridStyles } from "./style";

const styles = partsGridStyles();

export function ControlsDemo() {
  return (
    <div className={styles.controls()}>
      <ToggleGroup aria-label="Billing" defaultValue={[billingPeriods[0]]}>
        {billingPeriods.map((period) => (
          <ToggleGroupItem key={period} value={period}>
            {period}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Input aria-label="Search components" className={styles.search()} placeholder="Search components" type="search" />
      <HomeTabBar />
    </div>
  );
}
