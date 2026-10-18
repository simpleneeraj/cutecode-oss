import { z } from "zod";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { snippets, presentations, shareLinks } from "@/db/schema";
import { ShareVisibility } from "@/db/schema";
import { generateUniqueSlug } from "@/lib/share/slug";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../init";
import { publishRateLimit, checkRateLimit, cacheDel } from "@/lib/in-memory-store";
import { consumePublishQuota, getPublishQuota } from "@/lib/billing/publish-quota";
import { assertPremiumAssetsAllowed } from "@/lib/billing/premium-assets";
import { requireShareVisibility } from "@/lib/billing/require-capability";
import { publishedContent } from "@/lib/share/published-content";
import {
  descriptionSchema,
  elementsSchema,
  passcodeSchema,
  slideElementsSchema,
  slidesSchema,
  tagsSchema,
  titleSchema,
} from "@/lib/schemas";

export const publishRouter = router({
  publish: protectedProcedure
    .input(
      z.object({
        name: z.string().max(120).optional(),
        width: z.number().int().optional(),
        slides: slidesSchema.default({}),
        elements: elementsSchema,
        slideElements: slideElementsSchema.default({}),
        elementId: z.string().min(1),
        title: titleSchema.optional(),
        description: descriptionSchema.optional(),
        tags: tagsSchema.optional(),
        visibility: z.enum(ShareVisibility).default(ShareVisibility.PUBLIC),
        passcode: passcodeSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await checkRateLimit(publishRateLimit, `publish:${ctx.user.id}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many publish requests. Please wait a minute." });
      }

      const {
        name,
        width,
        elementId,
        title,
        description,
        tags,
        visibility,
        passcode,
      } = input;

      requireShareVisibility(ctx.user.plan, visibility);

      if (!input.elements[elementId]) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Missing required presentation elements." });
      }

      const { slides, elements, slideElements } = publishedContent(input, elementId);
      assertPremiumAssetsAllowed(ctx.user.plan, elements);

      const passcodeHash = visibility === ShareVisibility.PASSCODE && passcode ? await bcrypt.hash(passcode, 10) : null;

      const safeName = (name || "Untitled").slice(0, 120);
      const safeWidth = Math.max(400, Math.min(width ?? 680, 1600));

      const existingSnippet = await db.query.snippets.findFirst({
        where: and(eq(snippets.userId, ctx.user.id), eq(snippets.elementId, elementId)),
        with: {
          shareLinks: { columns: { slug: true, id: true }, orderBy: (shareLinks, { asc }) => [asc(shareLinks.createdAt)], limit: 1 },
        },
        orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
      });

      const existingSlug = existingSnippet?.shareLinks?.[0]?.slug;

      if (existingSnippet && existingSlug) {
        const existingLink = await db.query.shareLinks.findFirst({
          where: eq(shareLinks.slug, existingSlug),
          columns: { passcodeHash: true },
        });
        const keptPasscodeHash =
          visibility === ShareVisibility.PASSCODE ? (passcodeHash ?? existingLink?.passcodeHash ?? null) : null;
        if (visibility === ShareVisibility.PASSCODE && !keptPasscodeHash) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "A 6-digit passcode is required." });
        }

        const becomesPublic = visibility === ShareVisibility.PUBLIC && !existingSnippet.isPublic;
        const quota = await db.transaction(async (tx) => {
          const consumed = becomesPublic ? await consumePublishQuota(tx, ctx.user.id, { addsLiveSnippet: false }) : null;

          await tx
            .update(presentations)
            .set({ name: safeName, width: safeWidth, slides, elements, slideElements })
            .where(eq(presentations.id, existingSnippet.presentationId));

          await tx
            .update(snippets)
            .set({
              title: title ?? null,
              description: description ?? null,
              tags: tags ?? [],
              isPublic: visibility === ShareVisibility.PUBLIC,
            })
            .where(eq(snippets.id, existingSnippet.id));

          await tx
            .update(shareLinks)
            .set({
              visibility,
              passcodeHash: keptPasscodeHash,
              indexable: visibility === ShareVisibility.PUBLIC,
            })
            .where(eq(shareLinks.slug, existingSlug));

          return consumed;
        });

        await cacheDel(`shareLink:${existingSlug}`);
        return { slug: existingSlug, updated: true, quota: quota ?? (await getPublishQuota(db, ctx.user.id)) };
      }

      if (visibility === ShareVisibility.PASSCODE && !passcodeHash) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A 6-digit passcode is required." });
      }

      const slug = await generateUniqueSlug();

      const quota = await db.transaction(async (tx) => {
        const consumed = await consumePublishQuota(tx, ctx.user.id, { addsLiveSnippet: true });

        const [presentation] = await tx
          .insert(presentations)
          .values({
            userId: ctx.user.id,
            name: safeName,
            width: safeWidth,
            slides,
            elements,
            slideElements,
          })
          .returning();

        const [snippet] = await tx
          .insert(snippets)
          .values({
            userId: ctx.user.id,
            presentationId: presentation.id,
            elementId,
            title: title ?? null,
            description: description ?? null,
            tags: tags ?? [],
            isPublic: visibility === ShareVisibility.PUBLIC,
          })
          .returning();

        await tx.insert(shareLinks).values({
          userId: ctx.user.id,
          slug,
          targetType: "SNIPPET",
          targetId: snippet.id,
          snippetId: snippet.id,
          presentationId: presentation.id,
          visibility,
          passcodeHash,
          allowCopy: true,
          allowDownload: true,
          indexable: visibility === ShareVisibility.PUBLIC,
        });

        return consumed;
      });

      return { slug, updated: false, quota };
    }),

  quota: protectedProcedure.query(({ ctx }) => getPublishQuota(db, ctx.user.id)),
});
