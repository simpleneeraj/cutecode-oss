"use client";

import { Badge } from "@cutecode/ui/components/badge";
import { Select, SelectTrigger, SelectValue } from "@cutecode/ui/components/select";
import { Fragment } from "react";

const repeatCopy = {
  label: "Repeat",
  never: "Does not repeat",
  pro: "Pro",
  proHint: "Repeating events come with Pro",
};

const neverValue = "never";

const repeatItems = { [neverValue]: repeatCopy.never };

function LockedRepeat() {
  return (
    <Fragment>
      <Select disabled items={repeatItems} value={neverValue}>
        <SelectTrigger aria-label={`${repeatCopy.label}. ${repeatCopy.proHint}`} size="sm">
          <SelectValue />
        </SelectTrigger>
      </Select>
      <Badge aria-hidden="true" variant="info">
        {repeatCopy.pro}
      </Badge>
    </Fragment>
  );
}

export { LockedRepeat };
