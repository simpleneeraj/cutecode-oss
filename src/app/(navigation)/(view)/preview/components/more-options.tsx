"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  Edit01Icon,
  Globe02Icon,
  MoreHorizontalIcon,
  PinIcon,
  PinOffIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
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
          <HugeiconsIcon icon={MoreHorizontalIcon} aria-hidden="true" />
        </MenuTrigger>

        <MenuPopup align="end">
          <MenuItem render={<Link href={`/edit/${slug}`} />}>
            <HugeiconsIcon icon={Edit01Icon} aria-hidden="true" />
            Edit snippet
          </MenuItem>
          <MenuItem onClick={toggleVisibility}>
            <HugeiconsIcon icon={isPublic ? ViewOffIcon : Globe02Icon} aria-hidden="true" />
            {isPublic ? "Make unlisted" : "Make public"}
          </MenuItem>
          <MenuItem onClick={togglePinned}>
            <HugeiconsIcon icon={snippet.isPinned ? PinOffIcon : PinIcon} aria-hidden="true" />
            {snippet.isPinned ? "Unpin from profile" : "Pin to profile"}
          </MenuItem>
          <MenuSeparator />
          <MenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <HugeiconsIcon icon={Delete02Icon} aria-hidden="true" />
            Delete snippet
          </MenuItem>
        </MenuPopup>
      </Menu>

      <DeleteSnippetDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={removeSnippet} />
    </React.Fragment>
  );
}
