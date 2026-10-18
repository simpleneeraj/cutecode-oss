"use client";

import { SWRConfig, type SWRConfiguration } from "swr";
import { isClientError } from "@/lib/trpc-error";

const config: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 10_000,
  keepPreviousData: true,
  shouldRetryOnError: (error: unknown) => !isClientError(error),
};

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={config}>{children}</SWRConfig>;
}
