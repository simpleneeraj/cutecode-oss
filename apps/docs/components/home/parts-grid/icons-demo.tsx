import { AppIcon } from "@cutecode/ui/tactile/app-icon";

import { appIcons } from "./demo-data";
import { partsGridStyles } from "./style";

export function IconsDemo() {
  return (
    <div className={partsGridStyles().icons()}>
      {appIcons.map((item) => (
        <AppIcon icon={item.icon} key={item.id} tone={item.tone} />
      ))}
    </div>
  );
}
