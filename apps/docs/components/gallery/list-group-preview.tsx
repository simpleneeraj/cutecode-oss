"use client";

import { Tone } from "@cutecode/ui/tactile/tone";
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
import { BellIcon } from "@solar-icons/react/linear/bell";
import { SettingsIcon } from "@solar-icons/react/linear/settings";
import { UserIcon } from "@solar-icons/react/linear/user";

export function ListGroupPreview() {
  return (
    <ListGroup>
      <ListGroupHeader>Account</ListGroupHeader>
      <ListGroupRows>
        <ListGroupRow icon={UserIcon} tone={Tone.Blue}>
          <ListGroupTitle subtitle="ada@example.com">Profile</ListGroupTitle>
          <ListGroupChevron />
        </ListGroupRow>
        <ListGroupRow icon={BellIcon} tone={Tone.Pink}>
          <ListGroupTitle>Notifications</ListGroupTitle>
          <ListGroupValue>On</ListGroupValue>
        </ListGroupRow>
        <ListGroupRow icon={SettingsIcon} tone={Tone.Gray}>
          <ListGroupTitle>Settings</ListGroupTitle>
          <ListGroupChevron />
        </ListGroupRow>
      </ListGroupRows>
      <ListGroupFooter>Changes sync across your devices.</ListGroupFooter>
    </ListGroup>
  );
}
