import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { CopyIcon } from "@solar-icons/react/linear/copy";

export enum PackageManager {
  Npm = "npm",
  Pnpm = "pnpm",
  Bun = "bun",
}

export enum CopyState {
  Idle = "idle",
  Copied = "copied",
  Failed = "failed",
}

export const installCommand = {
  runners: {
    [PackageManager.Npm]: "npx shadcn@latest add",
    [PackageManager.Pnpm]: "pnpm dlx shadcn@latest add",
    [PackageManager.Bun]: "bunx --bun shadcn@latest add",
  },
  copyLabels: {
    [CopyState.Idle]: "Copy",
    [CopyState.Copied]: "Copied",
    [CopyState.Failed]: "Copy Failed",
  },
  copyIcons: {
    [CopyState.Idle]: CopyIcon,
    [CopyState.Copied]: CheckCircleIcon,
    [CopyState.Failed]: CopyIcon,
  },
  copyVariants: {
    [CopyState.Idle]: "filled",
    [CopyState.Copied]: "tinted",
    [CopyState.Failed]: "gray",
  } as const,
  resetDelay: 2000,
};
