import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { presentations, shareLinks, snippets } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, paginationInput } from "../init";
import { createPresentationSchema, syncPresentationSchema } from "@/lib/schemas";
import { assertPremiumAssetsAllowed, assertSlideLimit } from "@/lib/billing/premium-assets";

async function isShared(presentationId: string) {
  const [link, publicSnippet] = await Promise.all([
    db.query.shareLinks.findFirst({ where: eq(shareLinks.presentationId, presentationId), columns: { id: true } }),
    db.query.snippets.findFirst({
      where: and(eq(snippets.presentationId, presentationId), eq(snippets.isPublic, true)),
      columns: { id: true },
    }),
  ]);
  return !!link || !!publicSnippet;
}

export const presentationRouter = router({
  list: protectedProcedure.input(paginationInput).query(async ({ ctx, input }) => {
    const { page, limit } = input;
    const offset = (page - 1) * limit;

    const [presentationsRows, total] = await Promise.all([
      db.query.presentations.findMany({
        where: eq(presentations.userId, ctx.user.id),
        columns: {
          id: true,
          name: true,
          width: true,
          isPublic: true,
          thumbnailUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: (presentations, { desc }) => [desc(presentations.updatedAt)],
        offset,
        limit,
      }),
      db.$count(presentations, eq(presentations.userId, ctx.user.id)),
    ]);

    return { presentations: presentationsRows, total, page, limit };
  }),

  get: protectedProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx, input }) => {
    const presentation = await db.query.presentations.findFirst({
      where: and(eq(presentations.id, input.id), eq(presentations.userId, ctx.user.id)),
    });

    if (!presentation) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Presentation not found" });
    }

    return presentation;
  }),

  create: protectedProcedure.input(createPresentationSchema).mutation(async ({ ctx, input }) => {
    const [presentation] = await db
      .insert(presentations)
      .values({
        userId: ctx.user.id,
        name: input.name,
        width: input.width,
        slides: input.slides,
        elements: input.elements,
        slideElements: input.slideElements,
      })
      .returning();
    return presentation;
  }),

  sync: protectedProcedure
    .input(z.object({ id: z.string().min(1), data: syncPresentationSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.presentations.findFirst({
        where: and(eq(presentations.id, input.id), eq(presentations.userId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Presentation not found" });
      }

      if (await isShared(input.id)) {
        assertPremiumAssetsAllowed(ctx.user.plan, input.data.elements);
        assertSlideLimit(ctx.user.plan, input.data.slides);
      }

      const [updated] = await db
        .update(presentations)
        .set({
          ...(input.data.name && { name: input.data.name }),
          ...(input.data.width && { width: input.data.width }),
          slides: input.data.slides,
          elements: input.data.elements,
          slideElements: input.data.slideElements,
        })
        .where(eq(presentations.id, input.id))
        .returning();

      return updated;
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const existing = await db.query.presentations.findFirst({
      where: and(eq(presentations.id, input.id), eq(presentations.userId, ctx.user.id)),
    });

    if (!existing) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Presentation not found" });
    }

    await db.delete(presentations).where(eq(presentations.id, input.id));
    return { deleted: true, id: input.id };
  }),
});
