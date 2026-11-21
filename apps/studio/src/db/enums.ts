import { pgEnum } from "drizzle-orm/pg-core";

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const Plan = {
  FREE: "FREE",
  PRO: "PRO",
  PREMIUM: "PREMIUM",
} as const;

export type Plan = (typeof Plan)[keyof typeof Plan];

export const SubscriptionStatus = {
  TRIALING: "TRIALING",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  UNPAID: "UNPAID",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const ShareTarget = {
  SNIPPET: "SNIPPET",
  PRESENTATION: "PRESENTATION",
  COLLECTION: "COLLECTION",
} as const;

export type ShareTarget = (typeof ShareTarget)[keyof typeof ShareTarget];

export const ShareVisibility = {
  PUBLIC: "PUBLIC",
  UNLISTED: "UNLISTED",
  PASSCODE: "PASSCODE",
  PRIVATE: "PRIVATE",
} as const;

export type ShareVisibility = (typeof ShareVisibility)[keyof typeof ShareVisibility];

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const planEnum = pgEnum("plan", ["FREE", "PRO", "PREMIUM"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "TRIALING",
  "ACTIVE",
  "PAST_DUE",
  "UNPAID",
  "CANCELED",
  "EXPIRED",
]);
export const shareTargetEnum = pgEnum("share_target", ["SNIPPET", "PRESENTATION", "COLLECTION"]);
export const shareVisibilityEnum = pgEnum("share_visibility", ["PUBLIC", "UNLISTED", "PASSCODE", "PRIVATE"]);
