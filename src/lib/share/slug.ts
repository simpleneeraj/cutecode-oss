import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shareLinks } from "@/db/schema";

export async function generateUniqueSlug(size = 8, maxAttempts = 5): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const slug = nanoid(size);
    const existing = await db.query.shareLinks.findFirst({ where: eq(shareLinks.slug, slug), columns: { id: true } });
    if (!existing) return slug;
  }
  return nanoid(size + 6);
}
