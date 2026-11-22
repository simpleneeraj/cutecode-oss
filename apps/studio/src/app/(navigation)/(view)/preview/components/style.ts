import { tv } from "tailwind-variants";

export const profileStyles = tv({
  slots: {
    trigger: "relative size-control-medium rounded-full p-0",
    avatar: "size-full",
    planDot: "absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-brand ring-2 ring-background",
    planDotIcon: "size-2.5 text-background",
    popup: "w-64",
    identity: "flex items-center gap-3 px-row-inset py-1.5",
    identityAvatar: "size-control-medium",
    identityText: "flex min-w-0 flex-1 flex-col",
    name: "truncate text-density-body font-medium text-foreground",
    email: "truncate text-density-caption text-muted-foreground",
    stack: "flex flex-col",
    hint: "text-density-caption text-muted-foreground",
    legal: "flex flex-wrap gap-x-3 gap-y-1 px-row-inset pt-1 pb-1.5 text-density-caption text-muted-foreground",
    legalLink: "hover:text-foreground",
  },
});
