import { and, eq, inArray } from "drizzle-orm";
import { APIError } from "better-auth/api";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { ENTITLED_STATUSES } from "@/lib/billing/handle-dodo-event";
import { PRODUCT_LIST } from "@/lib/billing/products";

const CHECKOUT_PATHS = new Set(["/dodopayments/checkout", "/dodopayments/checkout-session"]);

export function isCheckoutPath(path: string) {
  return CHECKOUT_PATHS.has(path);
}

export function assertSlugOnlyCheckout(path: string, body: unknown) {
  if (path !== "/dodopayments/checkout-session") throw new APIError("NOT_FOUND");
  const keys = typeof body === "object" && body !== null ? Object.keys(body) : [];
  const slug = (body as { slug?: unknown } | null)?.slug;
  const known = PRODUCT_LIST.some((product) => product.productId && product.slug === slug);
  if (keys.length !== 1 || !known) {
    throw new APIError("BAD_REQUEST", { code: "INVALID_CHECKOUT", message: "Only a plan slug is accepted." });
  }
}

export async function assertNoEntitledSubscription(userId: string) {
  const active = await db.query.subscriptions.findFirst({
    where: and(eq(subscriptions.userId, userId), inArray(subscriptions.status, [...ENTITLED_STATUSES])),
    columns: { id: true },
  });
  if (!active) return;
  throw new APIError("FORBIDDEN", {
    code: "ACTIVE_SUBSCRIPTION",
    message: "You already have an active subscription. Change your plan from the billing portal.",
  });
}
