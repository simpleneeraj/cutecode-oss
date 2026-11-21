"use client";

import { Switch } from "@cutecode/ui/components/switch";
import {
  ListGroup,
  ListGroupFooter,
  ListGroupHeader,
  ListGroupRow,
  ListGroupRows,
  ListGroupTitle,
} from "@cutecode/ui/tactile/list-group";

import { previewSwitches } from "./constants";

export function PreviewSettings() {
  return (
    <ListGroup>
      <ListGroupHeader>Workspace</ListGroupHeader>
      <ListGroupRows>
        {previewSwitches.map((setting) => (
          <ListGroupRow icon={setting.icon} key={setting.id} tone={setting.tone}>
            <ListGroupTitle>{setting.title}</ListGroupTitle>
            <Switch aria-label={setting.title} defaultChecked={setting.isChecked} />
          </ListGroupRow>
        ))}
      </ListGroupRows>
      <ListGroupFooter>Changes apply to everyone in the workspace.</ListGroupFooter>
    </ListGroup>
  );
}
