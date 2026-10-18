import { TRPCClientError } from "@trpc/client";

export function isForbiddenError(error: unknown): boolean {
  return error instanceof TRPCClientError && error.data?.code === "FORBIDDEN";
}
