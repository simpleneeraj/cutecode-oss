import { Button } from "@cutecode/ui/components/button";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "@cutecode/ui/components/menu";
import { MenuDotsIcon } from "@solar-icons/react/linear/menu-dots";
import { TrashBinTrashIcon } from "@solar-icons/react/linear/trash-bin-trash";

import { menuActions } from "./demo-data";

export function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="gray" />}>
        Open Menu
        <MenuDotsIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup>
        {menuActions.map((action) => (
          <MenuItem key={action.label}>
            {action.label}
            <action.icon aria-hidden="true" />
          </MenuItem>
        ))}
        <MenuSeparator />
        <MenuItem variant="destructive">
          Delete
          <TrashBinTrashIcon aria-hidden="true" />
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
