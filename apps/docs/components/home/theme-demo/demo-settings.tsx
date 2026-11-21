"use client";

import { Switch } from "@cutecode/ui/components/switch";
import {
  ListGroup,
  ListGroupRow,
  ListGroupRows,
  ListGroupTitle,
  ListGroupValue,
} from "@cutecode/ui/tactile/list-group";
import { Tone } from "@cutecode/ui/tactile/tone";
import { BellIcon } from "@solar-icons/react/linear/bell";
import { MoonIcon } from "@solar-icons/react/linear/moon";
import { PaletteIcon } from "@solar-icons/react/linear/palette";

export function DemoSettings() {
  return (
    <ListGroup>
      <ListGroupRows>
        <ListGroupRow icon={BellIcon}>
          <ListGroupTitle>Notifications</ListGroupTitle>
          <Switch aria-label="Notifications" defaultChecked />
        </ListGroupRow>
        <ListGroupRow icon={MoonIcon}>
          <ListGroupTitle>Focus</ListGroupTitle>
          <ListGroupValue>Work</ListGroupValue>
        </ListGroupRow>
        <ListGroupRow icon={PaletteIcon} tone={Tone.Accent}>
          <ListGroupTitle>Appearance</ListGroupTitle>
          <ListGroupValue>Auto</ListGroupValue>
        </ListGroupRow>
      </ListGroupRows>
    </ListGroup>
  );
}
