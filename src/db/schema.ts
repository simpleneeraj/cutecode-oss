import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  primaryKey,
  unique,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { users } from "./auth-schema";
import {
  planEnum,
  subscriptionStatusEnum,
  shareTargetEnum,
  shareVisibilityEnum,
} from "./enums";

export * from "./enums";
export { users, sessions, accounts, verifications, rateLimits } from "./auth-schema";

export const userFollows = pgTable(
  "user_follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    index("user_follows_follower_id_idx").on(t.followerId),
    index("user_follows_following_id_idx").on(t.followingId),
  ],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    dodoSubscriptionId: text("dodo_subscription_id").notNull().unique(),
    dodoCustomerId: text("dodo_customer_id"),
    plan: planEnum("plan").notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    gracePeriodEnd: timestamp("grace_period_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    canceledAt: timestamp("canceled_at"),
    lastEventAt: timestamp("last_event_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("subscriptions_status_idx").on(t.status),
    index("subscriptions_period_end_idx").on(t.currentPeriodEnd),
    index("subscriptions_grace_period_end_idx").on(t.gracePeriodEnd),
  ],
);

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    type: text("type").notNull(),
    rawPayload: jsonb("raw_payload").$type<unknown>().notNull(),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("webhook_events_type_idx").on(t.type),
    index("webhook_events_created_at_idx").on(t.createdAt),
  ],
);

export const presentations = pgTable(
  "presentations",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
    width: integer("width").notNull().default(680),
    isPublic: boolean("is_public").notNull().default(false),
    thumbnailUrl: text("thumbnail_url"),
    slides: jsonb("slides").$type<Record<string, unknown>>().notNull().default({}),
    elements: jsonb("elements").$type<Record<string, unknown>>().notNull().default({}),
    slideElements: jsonb("slide_elements").$type<Record<string, string[]>>().notNull().default({}),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("presentations_user_id_idx").on(t.userId)],
);

export const snippets = pgTable(
  "snippets",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    presentationId: text("presentation_id")
      .notNull()
      .references(() => presentations.id, { onDelete: "cascade" }),
    elementId: text("element_id").notNull(),
    title: text("title"),
    description: text("description"),
    tags: text("tags").array().notNull().default([]),
    isPublic: boolean("is_public").notNull().default(false),
    isE2EEncrypted: boolean("is_e2e_encrypted").notNull().default(false),
    encryptionHint: text("encryption_hint"),
    pinnedAt: timestamp("pinned_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("snippets_user_id_idx").on(t.userId),
    index("snippets_presentation_id_idx").on(t.presentationId),
  ],
);

export const shareLinks = pgTable(
  "share_links",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    targetType: shareTargetEnum("target_type").notNull(),
    targetId: text("target_id").notNull(),
    snippetId: text("snippet_id").references(() => snippets.id, { onDelete: "set null" }),
    presentationId: text("presentation_id").references(() => presentations.id, { onDelete: "set null" }),
    visibility: shareVisibilityEnum("visibility").notNull().default("PUBLIC"),
    passcodeHash: text("passcode_hash"),
    isE2EEncrypted: boolean("is_e2e_encrypted").notNull().default(false),
    encryptionHint: text("encryption_hint"),
    maxViews: integer("max_views"),
    viewCount: integer("view_count").notNull().default(0),
    expiresAt: timestamp("expires_at"),
    allowDownload: boolean("allow_download").notNull().default(true),
    allowCopy: boolean("allow_copy").notNull().default(true),
    indexable: boolean("indexable").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("share_links_slug_idx").on(t.slug),
    index("share_links_user_id_idx").on(t.userId),
    index("share_links_target_idx").on(t.targetType, t.targetId),
    index("share_links_expires_at_idx").on(t.expiresAt),
  ],
);

export const shareLinkViews = pgTable(
  "share_link_views",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    shareLinkId: text("share_link_id")
      .notNull()
      .references(() => shareLinks.id, { onDelete: "cascade" }),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    referer: text("referer"),
    passcodeUsed: boolean("passcode_used").notNull().default(false),
    viewedAt: timestamp("viewed_at").notNull().defaultNow(),
  },
  (t) => [index("share_link_views_idx").on(t.shareLinkId, t.viewedAt)],
);

export const shareLinkAccess = pgTable(
  "share_link_access",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    shareLinkId: text("share_link_id")
      .notNull()
      .references(() => shareLinks.id, { onDelete: "cascade" }),
    grantedToUserId: text("granted_to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    grantedAt: timestamp("granted_at").notNull().defaultNow(),
    revokedAt: timestamp("revoked_at"),
  },
  (t) => [
    unique("share_link_access_unique").on(t.shareLinkId, t.grantedToUserId),
    index("share_link_access_user_idx").on(t.grantedToUserId),
  ],
);

export const snippetComments = pgTable(
  "snippet_comments",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    snippetId: text("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("snippet_comments_idx").on(t.snippetId, t.createdAt),
    index("snippet_comments_user_idx").on(t.userId),
  ],
);

export const snippetUpvotes = pgTable(
  "snippet_upvotes",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    snippetId: text("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    unique("snippet_upvotes_unique").on(t.snippetId, t.userId),
    index("snippet_upvotes_snippet_idx").on(t.snippetId),
  ],
);

export const snippetBookmarks = pgTable(
  "snippet_bookmarks",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    snippetId: text("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    unique("snippet_bookmarks_unique").on(t.snippetId, t.userId),
    index("snippet_bookmarks_snippet_idx").on(t.snippetId),
    index("snippet_bookmarks_user_idx").on(t.userId),
  ],
);

export const publishEvents = pgTable(
  "publish_events",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("publish_events_user_created_idx").on(t.userId, t.createdAt)],
);

export const shortUrls = pgTable(
  "short_urls",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    code: text("code").notNull().unique(),
    url: text("url").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    ref: text("ref"),
    clicks: integer("clicks").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("short_urls_code_idx").on(t.code)],
);

export const usersRelations = relations(users, ({ many, one }) => ({
  snippets: many(snippets),
  presentations: many(presentations),
  shareLinks: many(shareLinks),
  shareAccess: many(shareLinkAccess),
  snippetComments: many(snippetComments),
  snippetUpvotes: many(snippetUpvotes),
  snippetBookmarks: many(snippetBookmarks),
  subscription: one(subscriptions),
  followers: many(userFollows, { relationName: "UserFollowedBy" }),
  following: many(userFollows, { relationName: "UserFollows" }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const presentationsRelations = relations(presentations, ({ one, many }) => ({
  user: one(users, { fields: [presentations.userId], references: [users.id] }),
  snippets: many(snippets),
  shareLinks: many(shareLinks),
}));

export const snippetsRelations = relations(snippets, ({ one, many }) => ({
  user: one(users, { fields: [snippets.userId], references: [users.id] }),
  presentation: one(presentations, { fields: [snippets.presentationId], references: [presentations.id] }),
  shareLinks: many(shareLinks),
  comments: many(snippetComments),
  upvotes: many(snippetUpvotes),
  bookmarks: many(snippetBookmarks),
}));

export const shareLinksRelations = relations(shareLinks, ({ one, many }) => ({
  user: one(users, { fields: [shareLinks.userId], references: [users.id] }),
  snippet: one(snippets, { fields: [shareLinks.snippetId], references: [snippets.id] }),
  presentation: one(presentations, { fields: [shareLinks.presentationId], references: [presentations.id] }),
  views: many(shareLinkViews),
  granted: many(shareLinkAccess),
}));

export const shareLinkViewsRelations = relations(shareLinkViews, ({ one }) => ({
  shareLink: one(shareLinks, { fields: [shareLinkViews.shareLinkId], references: [shareLinks.id] }),
}));

export const shareLinkAccessRelations = relations(shareLinkAccess, ({ one }) => ({
  shareLink: one(shareLinks, { fields: [shareLinkAccess.shareLinkId], references: [shareLinks.id] }),
  grantedTo: one(users, { fields: [shareLinkAccess.grantedToUserId], references: [users.id] }),
}));

export const snippetCommentsRelations = relations(snippetComments, ({ one }) => ({
  snippet: one(snippets, { fields: [snippetComments.snippetId], references: [snippets.id] }),
  user: one(users, { fields: [snippetComments.userId], references: [users.id] }),
}));

export const snippetUpvotesRelations = relations(snippetUpvotes, ({ one }) => ({
  snippet: one(snippets, { fields: [snippetUpvotes.snippetId], references: [snippets.id] }),
  user: one(users, { fields: [snippetUpvotes.userId], references: [users.id] }),
}));

export const snippetBookmarksRelations = relations(snippetBookmarks, ({ one }) => ({
  snippet: one(snippets, { fields: [snippetBookmarks.snippetId], references: [snippets.id] }),
  user: one(users, { fields: [snippetBookmarks.userId], references: [users.id] }),
}));

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, { fields: [userFollows.followerId], references: [users.id], relationName: "UserFollows" }),
  following: one(users, { fields: [userFollows.followingId], references: [users.id], relationName: "UserFollowedBy" }),
}));

export type DbUser = typeof users.$inferSelect;
export type DbSubscription = typeof subscriptions.$inferSelect;
export type DbSnippet = typeof snippets.$inferSelect;
export type DbPresentation = typeof presentations.$inferSelect;
export type DbShareLink = typeof shareLinks.$inferSelect;
export type DbSnippetComment = typeof snippetComments.$inferSelect;
export type DbShortUrl = typeof shortUrls.$inferSelect;
