import { TRPCClientError } from "@trpc/client";

export function isForbiddenError(error: unknown): boolean {
  return error instanceof TRPCClientError && error.data?.code === "FORBIDDEN";
}

export function isClientError(error: unknown): boolean {
  if (!(error instanceof TRPCClientError)) return false;
  const status = error.data?.httpStatus;
  return typeof status === "number" && status >= 400 && status < 500;
}
