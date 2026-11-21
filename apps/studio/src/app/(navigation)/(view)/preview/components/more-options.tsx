"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EyeClosedIcon } from "@solar-icons/react/linear/eye-closed";
import { GlobalIcon } from "@solar-icons/react/linear/global";
import { MenuDotsIcon } from "@solar-icons/react/linear/menu-dots";
import { PenIcon } from "@solar-icons/react/linear/pen";
import { PinIcon } from "@solar-icons/react/linear/pin";
import { PinListIcon } from "@solar-icons/react/linear/pin-list";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/linear/trash-bin-minimalistic";
import { Button } from "@cutecode/ui/components/button";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "@cutecode/ui/components/menu";
import { DeleteSnippetDialog } from "./delete-snippet-dialog";
import { useOwnerActions } from "../hooks/use-owner-actions";
import type { OwnedSnippet } from "../hooks/use-snippet-preview";

type MoreOptionsProps = {
  slug: string;
  snippet: OwnedSnippet;
};

export default function MoreOptions({ slug, snippet }: MoreOptionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { isPublic, toggleVisibility, togglePinned, removeSnippet } = useOwnerActions(snippet);

  return (
    <React.Fragment>
      <Menu>
        <MenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="More options" />}>
          <MenuDotsIcon aria-hidden="true" />
        </MenuTrigger>

        <MenuPopup align="end">
          <MenuItem render={<Link href={`/edit/${slug}`} />}>
            <PenIcon aria-hidden="true" />
            Edit snippet
          </MenuItem>
          <MenuItem onClick={toggleVisibility}>
            {isPublic ? <EyeClosedIcon aria-hidden="true" /> : <GlobalIcon aria-hidden="true" />}
            {isPublic ? "Make unlisted" : "Make public"}
          </MenuItem>
          <MenuItem onClick={togglePinned}>
            {snippet.isPinned ? <PinListIcon aria-hidden="true" /> : <PinIcon aria-hidden="true" />}
            {snippet.isPinned ? "Unpin from profile" : "Pin to profile"}
          </MenuItem>
          <MenuSeparator />
          <MenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <TrashBinMinimalisticIcon aria-hidden="true" />
            Delete snippet
          </MenuItem>
        </MenuPopup>
      </Menu>

      <DeleteSnippetDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={removeSnippet} />
    </React.Fragment>
  );
}
