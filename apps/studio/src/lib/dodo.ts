import "server-only";
import { DodoPayments } from "dodopayments";

const globalForDodo = globalThis as unknown as { dodoClient?: DodoPayments };

export const dodoClient =
  globalForDodo.dodoClient ??
  new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode") ?? "test_mode",
  });

if (process.env.NODE_ENV !== "production") globalForDodo.dodoClient = dodoClient;

export type DodoProduct = Awaited<ReturnType<DodoPayments["products"]["retrieve"]>>;
