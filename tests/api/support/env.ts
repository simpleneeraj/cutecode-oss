export const PRODUCT = {
  PRO_MONTHLY: "pdt_test_pro_monthly",
  PRO_YEARLY: "pdt_test_pro_yearly",
  PREMIUM_MONTHLY: "pdt_test_premium_monthly",
  PREMIUM_YEARLY: "pdt_test_premium_yearly",
  LEGACY_PREMIUM: "pdt_test_legacy_premium",
} as const;

export const WEBHOOK_SECRET = `whsec_${Buffer.from("cool-snippets-test-webhook-secret").toString("base64")}`;

export const CRON_SECRET = "test-cron-secret";

export const AUTH_SECRET = "test-better-auth-secret-0123456789abcdef";

export const BASE_URL = "http://localhost:3000";

export const TEST_ENV = {
  BETTER_AUTH_SECRET: AUTH_SECRET,
  BETTER_AUTH_URL: BASE_URL,
  NEXT_PUBLIC_BASE_URL: BASE_URL,
  DODO_PAYMENTS_API_KEY: "test_dodo_api_key",
  DODO_PAYMENTS_ENVIRONMENT: "test_mode",
  DODO_PAYMENTS_WEBHOOK_KEY: WEBHOOK_SECRET,
  CRON_SECRET,
  NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY: PRODUCT.PRO_MONTHLY,
  NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY: PRODUCT.PRO_YEARLY,
  NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_MONTHLY: PRODUCT.PREMIUM_MONTHLY,
  NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_YEARLY: PRODUCT.PREMIUM_YEARLY,
  NEXT_PUBLIC_DODO_PRODUCT_PREMIUM: PRODUCT.LEGACY_PREMIUM,
};
