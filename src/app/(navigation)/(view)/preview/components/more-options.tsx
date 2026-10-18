"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelCircleIcon,
  CodeSquareIcon,
  Edit01Icon,
  EyeIcon,
  Globe02Icon,
  LockIcon,
  PinIcon,
  Delete02Icon,
  Alert01Icon,
  MoreHorizontalIcon,
  ThumbsDownIcon,
} from "@hugeicons/core-free-icons";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import React, { useState } from "react";
import { EmbedDialog } from "./embed-dialog";
import { toast } from "@/components/toast";

type Visibility = "public" | "private" | "unlisted";

type MoreOptionsProps = {
  slug: string;
  currentUserId?: string;
  authorId?: string;
  visibility?: Visibility;
  onEdit?: () => void;
  onDelete?: () => void;
  onVisibilityChange?: (v: Visibility) => void;
  onPin?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onNotInterested?: () => void;
};

const VISIBILITY_CYCLE: Record<Visibility, { next: Visibility; label: string; icon: React.ReactNode }> = {
  public: {
    next: "unlisted",
    label: "Make Unlisted",
    icon: <HugeiconsIcon icon={EyeIcon} className="size-4" aria-hidden />,
  },
  unlisted: {
    next: "private",
    label: "Make Private",
    icon: <HugeiconsIcon icon={LockIcon} className="size-4" aria-hidden />,
  },
  private: {
    next: "public",
    label: "Make Public",
    icon: <HugeiconsIcon icon={Globe02Icon} className="size-4" aria-hidden />,
  },
};

const testFun = () => {
  console.log("testFun");
  toast.info("Feature coming soon!", { id: "testFun" });
};
export default function MoreOptions({
  slug,
  currentUserId,
  authorId,
  visibility = "public",
  onEdit = () => testFun(),
  onDelete = () => testFun(),
  onVisibilityChange = () => testFun(),
  onPin = () => testFun(),
  onReport = () => testFun(),
  onBlock = () => testFun(),
  onNotInterested = () => testFun(),
}: MoreOptionsProps) {
  const [embedOpen, setEmbedOpen] = useState(false);

  const isOwner = !!currentUserId && currentUserId === authorId;
  const vis = VISIBILITY_CYCLE[visibility];

  return (
    <React.Fragment>
      <Menu>
        <MenuTrigger render={<Button variant="outline" size="sm" aria-label="More options" />}>
          <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" aria-hidden />
        </MenuTrigger>

        <MenuPopup align="end">
          {isOwner ? (
            <>
              <MenuItem onClick={onEdit}>
                <HugeiconsIcon icon={Edit01Icon} className="size-4" aria-hidden />
                Edit Snippet
              </MenuItem>

              <MenuItem onClick={() => onVisibilityChange?.(vis.next)}>
                {vis.icon}
                {vis.label}
              </MenuItem>

              <MenuItem onClick={onPin}>
                <HugeiconsIcon icon={PinIcon} className="size-4" aria-hidden />
                Pin to Profile
              </MenuItem>

              <MenuSeparator />

              <MenuItem onClick={() => setEmbedOpen(true)}>
                <HugeiconsIcon icon={CodeSquareIcon} className="size-4" aria-hidden />
                Embed Snippet
              </MenuItem>
              <MenuSeparator />

              <MenuItem onClick={onDelete} className={"text-destructive focus:text-destructive"}>
                <HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden />
                Delete Snippet
              </MenuItem>
            </>
          ) : (
            <>
              {/* ── Viewer actions ── */}
              <MenuItem onClick={() => setEmbedOpen(true)}>
                <HugeiconsIcon icon={CodeSquareIcon} className="size-4" aria-hidden />
                Embed Snippet
              </MenuItem>

              <MenuSeparator />

              <MenuItem onClick={onNotInterested}>
                <HugeiconsIcon icon={ThumbsDownIcon} className="size-4" aria-hidden />
                Not Interested
              </MenuItem>

              <MenuItem onClick={onReport}>
                <HugeiconsIcon icon={Alert01Icon} className="size-4" aria-hidden />
                Report
              </MenuItem>

              <MenuItem onClick={onBlock} className="text-destructive focus:text-destructive">
                <HugeiconsIcon icon={CancelCircleIcon} className="size-4" aria-hidden />
                Block User
              </MenuItem>
            </>
          )}
        </MenuPopup>
      </Menu>

      <EmbedDialog slug={slug} open={embedOpen} onOpenChange={setEmbedOpen} />
    </React.Fragment>
  );
}
