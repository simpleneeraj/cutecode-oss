import { z } from "zod";
import { and, eq, desc, lt, inArray } from "drizzle-orm";
import { db } from "@/db";
import { users, userFollows, snippets } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "../init";
import { apiRateLimit, socialRateLimit, checkRateLimit, cacheGet, cacheSet, cacheDel } from "@/lib/in-memory-store";

const PAGE_SIZE = 20;

export const userRouter = router({
  profile: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const { success } = await checkRateLimit(apiRateLimit, `user-profile:${ctx.ip}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests." });
      }

      const cacheKey = `user-profile:${userId}`;
      let profile = await cacheGet<{
        id: string;
        name: string | null;
        plan: string;
        createdAt: Date;
        _count: { followers: number; following: number; snippets: number };
      }>(cacheKey);

      if (!profile) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { id: true, name: true, plan: true, createdAt: true },
        });

        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

        const [followers, following, snippetCount] = await Promise.all([
          db.$count(userFollows, eq(userFollows.followingId, userId)),
          db.$count(userFollows, eq(userFollows.followerId, userId)),
          db.$count(snippets, eq(snippets.userId, userId)),
        ]);

        profile = { ...user, _count: { followers, following, snippets: snippetCount } };
        await cacheSet(cacheKey, profile, 60);
      }

      let isFollowing = false;
      let isOwnProfile = false;

      if (ctx.user) {
        isOwnProfile = ctx.user.id === userId;
        if (!isOwnProfile) {
          const follow = await db.query.userFollows.findFirst({
            where: and(eq(userFollows.followerId, ctx.user.id), eq(userFollows.followingId, userId)),
          });
          isFollowing = !!follow;
        }
      }

      return { ...profile, isFollowing, isOwnProfile };
    }),

  followers: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, cursor } = input;

      const { success } = await checkRateLimit(apiRateLimit, `followers-list:${ctx.ip}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests." });
      }

      const target = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { id: true } });
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      let cursorCreatedAt: Date | null = null;
      if (cursor) {
        const cursorRow = await db.query.userFollows.findFirst({
          where: and(eq(userFollows.followerId, cursor), eq(userFollows.followingId, userId)),
          columns: { createdAt: true },
        });
        cursorCreatedAt = cursorRow?.createdAt ?? null;
      }

      const rows = await db.query.userFollows.findMany({
        where: and(
          eq(userFollows.followingId, userId),
          ...(cursorCreatedAt ? [lt(userFollows.createdAt, cursorCreatedAt)] : []),
        ),
        orderBy: (userFollows, { desc }) => [desc(userFollows.createdAt)],
        limit: PAGE_SIZE,
        with: { follower: { columns: { id: true, name: true, plan: true } } },
      });

      let viewerFollowingSet = new Set<string>();
      if (ctx.user && rows.length > 0) {
        const followerIds = rows.map((r) => r.follower.id);
        const follows = await db.query.userFollows.findMany({
          where: and(eq(userFollows.followerId, ctx.user.id), inArray(userFollows.followingId, followerIds)),
          columns: { followingId: true },
        });
        viewerFollowingSet = new Set(follows.map((f) => f.followingId));
      }

      const usersList = rows.map((r) => ({
        ...r.follower,
        _count: { followers: 0 },
        followedAt: r.createdAt,
        isFollowing: viewerFollowingSet.has(r.follower.id),
        isOwnProfile: r.follower.id === ctx.user?.id,
      }));

      const nextCursor = rows.length === PAGE_SIZE ? rows[rows.length - 1].follower.id : null;
      return { users: usersList, nextCursor, total: usersList.length };
    }),

  following: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, cursor } = input;

      const { success } = await checkRateLimit(apiRateLimit, `following-list:${ctx.ip}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests." });
      }

      const target = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { id: true } });
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      let cursorCreatedAt: Date | null = null;
      if (cursor) {
        const cursorRow = await db.query.userFollows.findFirst({
          where: and(eq(userFollows.followerId, userId), eq(userFollows.followingId, cursor)),
          columns: { createdAt: true },
        });
        cursorCreatedAt = cursorRow?.createdAt ?? null;
      }

      const rows = await db.query.userFollows.findMany({
        where: and(
          eq(userFollows.followerId, userId),
          ...(cursorCreatedAt ? [lt(userFollows.createdAt, cursorCreatedAt)] : []),
        ),
        orderBy: (userFollows, { desc }) => [desc(userFollows.createdAt)],
        limit: PAGE_SIZE,
        with: { following: { columns: { id: true, name: true, plan: true } } },
      });

      let viewerFollowingSet = new Set<string>();
      if (ctx.user && rows.length > 0) {
        const targetIds = rows.map((r) => r.following.id);
        const follows = await db.query.userFollows.findMany({
          where: and(eq(userFollows.followerId, ctx.user.id), inArray(userFollows.followingId, targetIds)),
          columns: { followingId: true },
        });
        viewerFollowingSet = new Set(follows.map((f) => f.followingId));
      }

      const usersList = rows.map((r) => ({
        ...r.following,
        _count: { followers: 0 },
        followedAt: r.createdAt,
        isFollowing: viewerFollowingSet.has(r.following.id),
        isOwnProfile: r.following.id === ctx.user?.id,
      }));

      const nextCursor = rows.length === PAGE_SIZE ? rows[rows.length - 1].following.id : null;
      return { users: usersList, nextCursor, total: usersList.length };
    }),

  toggleFollow: protectedProcedure
    .input(z.object({ targetUserId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { targetUserId } = input;

      if (ctx.user.id === targetUserId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot follow yourself" });
      }

      const { success } = await checkRateLimit(socialRateLimit, `follow:${ctx.user.id}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests. Slow down." });
      }

      const targetUser = await db.query.users.findFirst({ where: eq(users.id, targetUserId), columns: { id: true } });
      if (!targetUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const existing = await db.query.userFollows.findFirst({
        where: and(eq(userFollows.followerId, ctx.user.id), eq(userFollows.followingId, targetUserId)),
      });

      if (existing) {
        await db
          .delete(userFollows)
          .where(and(eq(userFollows.followerId, ctx.user.id), eq(userFollows.followingId, targetUserId)));
        const count = await db.$count(userFollows, eq(userFollows.followingId, targetUserId));
        await Promise.all([cacheDel(`user-profile:${targetUserId}`), cacheDel(`user-profile:${ctx.user.id}`)]);
        return { following: false, followerCount: count };
      }

      await db.insert(userFollows).values({ followerId: ctx.user.id, followingId: targetUserId });
      const count = await db.$count(userFollows, eq(userFollows.followingId, targetUserId));
      await Promise.all([cacheDel(`user-profile:${targetUserId}`), cacheDel(`user-profile:${ctx.user.id}`)]);
      return { following: true, followerCount: count };
    }),
});
