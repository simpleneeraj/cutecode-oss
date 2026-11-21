import { CardStack } from "@cutecode/ui/tactile/card-stack";

import { stackCards } from "./demo-data";
import { partsGridStyles } from "./style";

export function StackDemo() {
  return (
    <div className={partsGridStyles().stack()}>
      <CardStack cards={stackCards} />
    </div>
  );
}
