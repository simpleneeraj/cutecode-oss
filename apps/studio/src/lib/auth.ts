import { betterAuth } from "better-auth";
import { createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { dodopayments, checkout, portal, webhooks } from "@dodopayments/better-auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Plan, Role } from "@/db/schema";
import { sendVerificationEmail, sendResetPassword } from "@/lib/ses";
import { handleDodoEvent } from "@/lib/billing/handle-dodo-event";
import { PRODUCT_LIST } from "@/lib/billing/products";
import { assertNoEntitledSubscription, assertSlugOnlyCheckout, isCheckoutPath } from "@/lib/billing/checkout-guard";
import { dodoClient } from "@/lib/dodo";
import { CLIENT_IP_HEADER } from "@/lib/client-ip";
import { kv } from "@/lib/kv";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL].filter(Boolean) as string[],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: sendResetPassword,
  },
  emailVerification: {
    sendVerificationEmail: sendVerificationEmail,
    sendOnSignUp: true,
  },
  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? { github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET } }
      : {}),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
      : {}),
  } as never,
  secondaryStorage: {
    get: (key) => kv().get(key),
    set: (key, value, ttl) => kv().set(key, value, ttl),
    delete: (key) => kv().del(key),
    getAndDelete: (key) => kv().getAndDelete(key),
    increment: (key, ttl) => kv().incr(key, ttl),
  },
  session: {
    storeSessionInDatabase: true,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/*": { window: 60, max: 5 },
      "/sign-up/*": { window: 600, max: 5 },
      "/request-password-reset": { window: 3600, max: 3 },
      "/reset-password": { window: 600, max: 5 },
      "/send-verification-email": { window: 3600, max: 3 },
      "/change-password": { window: 600, max: 5 },
      "/change-email": { window: 3600, max: 3 },
      "/dodopayments/checkout-session": { window: 60, max: 5 },
      "/dodopayments/webhooks": false,
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: [CLIENT_IP_HEADER],
    },
  },
  user: {
    additionalFields: {
      plan: { type: "string", defaultValue: Plan.FREE, input: false },
      role: { type: "string", defaultValue: Role.USER, input: false },
      trialUsed: { type: "boolean", defaultValue: false, input: false },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (!isCheckoutPath(ctx.path)) return;
      assertSlugOnlyCheckout(ctx.path, ctx.body);
      const session = await getSessionFromCtx(ctx);
      if (session) await assertNoEntitledSubscription(session.user.id);
      return { context: { body: { ...ctx.body, feature_flags: { allow_discount_code: true } } } };
    }),
  },
  plugins: [
    dodopayments({
      client: dodoClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: PRODUCT_LIST.flatMap(({ productId, slug }) => (productId ? [{ productId, slug }] : [])),
          successUrl: `${process.env.BETTER_AUTH_URL}/checkout/success`,
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({ webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY ?? "", onPayload: handleDodoEvent }),
      ],
    }),
  ],
});

export type Auth = typeof auth;
