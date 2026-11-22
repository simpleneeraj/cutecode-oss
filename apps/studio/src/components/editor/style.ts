import { tv } from "tailwind-variants";

export const toolbarActionStyles = tv({
  slots: {
    button: "size-control-medium",
    shortcut: "flex items-center gap-2",
  },
});
