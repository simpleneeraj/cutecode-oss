"use client";

import { Switch } from "@cutecode/ui/components/switch";
import {
  ListGroup,
  ListGroupChevron,
  ListGroupFooter,
  ListGroupHeader,
  ListGroupRow,
  ListGroupRows,
  ListGroupTitle,
  ListGroupValue,
} from "@cutecode/ui/tactile/list-group";
import { Tone } from "@cutecode/ui/tactile/tone";
import { PaletteIcon } from "@solar-icons/react/linear/palette";

import { settingSwitches } from "./demo-data";

export function SettingsDemo() {
  return (
    <ListGroup>
      <ListGroupHeader>Preferences</ListGroupHeader>
      <ListGroupRows>
        {settingSwitches.map((setting) => (
          <ListGroupRow icon={setting.icon} key={setting.id} tone={setting.tone}>
            <ListGroupTitle>{setting.title}</ListGroupTitle>
            <Switch aria-label={setting.title} defaultChecked={setting.isChecked} />
          </ListGroupRow>
        ))}
        <ListGroupRow icon={PaletteIcon} tone={Tone.Orange}>
          <ListGroupTitle>Accent</ListGroupTitle>
          <ListGroupValue>Blue</ListGroupValue>
          <ListGroupChevron />
        </ListGroupRow>
      </ListGroupRows>
      <ListGroupFooter>These rows are the real List group.</ListGroupFooter>
    </ListGroup>
  );
}
