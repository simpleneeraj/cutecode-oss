"use client";

import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { avatarUrl } from "@/lib/avatar";

export function useUser() {
  const { data: res, isLoading } = useSWR("auth-session", () => authClient.getSession(), {
    dedupingInterval: 60_000,
  });

  const sessionData = (res as { data?: { user?: Record<string, unknown> } | null } | null)?.data ?? null;
  const user = sessionData?.user ?? null;

  const mapped = user
    ? {
        id: user.id as string,
        fullName: (user.name as string) || "User",
        username: ((user.email as string) || "").split("@")[0] || "user",
        primaryEmailAddress: { emailAddress: (user.email as string) || "" },
        imageUrl:
          (user.image as string | null) ||
          avatarUrl((user.name as string) || (user.email as string)),
        publicMetadata: {
          plan: user.plan ?? "FREE",
          role: user.role ?? "USER",
        },
      }
    : null;

  return {
    user: mapped,
    isSignedIn: !!mapped,
    isLoaded: !isLoading,
  };
}

export function useLinkedAccounts(isEnabled: boolean) {
  return useSWR(isEnabled ? "auth-accounts" : null, () => authClient.listAccounts());
}

export function useAuthActions() {
  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return {
    signOut,
  };
}
