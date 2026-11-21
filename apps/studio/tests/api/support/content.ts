import { randomUUID } from "node:crypto";
import { vi } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { presentations, shareLinks, snippets, ShareVisibility } from "@/db/schema";
import type { Caller } from "./caller";

export const PREMIUM_THEME = "neon-dreams";
export const FREE_THEME = "mono";
export const PREMIUM_FONT = "Victor Mono Italic";
export const FREE_FONT = "DM Mono";
export const PASSCODE = "482915";

type ElementOptions = { theme?: string; fontFamily?: string; code?: string };

export function element({ theme = FREE_THEME, fontFamily = FREE_FONT, code = "console.log(1)" }: ElementOptions = {}) {
  return { type: "code", code, language: "javascript", properties: { theme }, style: { fontFamily } };
}

type PublishOptions = ElementOptions & {
  elementId?: string;
  title?: string;
  description?: string;
  tags?: string[];
  visibility?: ShareVisibility;
  passcode?: string;
};

export function publishInput(options: PublishOptions = {}) {
  const elementId = options.elementId ?? `el_${randomUUID()}`;
  return {
    name: "Test presentation",
    width: 680,
    elements: { [elementId]: element(options) },
    slideElements: { s1: [elementId] },
    elementId,
    title: options.title ?? "Test snippet",
    description: options.description,
    tags: options.tags,
    visibility: options.visibility ?? ShareVisibility.PUBLIC,
    passcode: options.passcode,
  };
}

const RATE_LIMIT_STEP_MS = 7_000;

export function useSteppedClock() {
  vi.useFakeTimers({ toFake: ["Date"], now: Date.now() });
}

export function stepClock() {
  if (vi.isFakeTimers()) vi.setSystemTime(Date.now() + RATE_LIMIT_STEP_MS);
}

export async function publish(caller: Caller, options: PublishOptions = {}) {
  stepClock();
  const result = await caller.publish.publish(publishInput(options));
  return shareBySlug(result.slug);
}

export async function publishMany(caller: Caller, count: number, options: PublishOptions = {}) {
  const published = [];
  for (let index = 0; index < count; index++) published.push(await publish(caller, options));
  return published;
}

export async function shareBySlug(slug: string) {
  const link = await db.query.shareLinks.findFirst({ where: eq(shareLinks.slug, slug) });
  if (!link) throw new Error(`share ${slug} missing`);
  return link;
}

export async function readPresentation(presentationId: string) {
  return db.query.presentations.findFirst({ where: eq(presentations.id, presentationId) });
}

export async function insertShare(
  userId: string,
  { visibility = ShareVisibility.PUBLIC, passcodeHash = null, title = "Seeded snippet", description = "Seeded description", tags = ["seeded"], theme = FREE_THEME } : {
    visibility?: ShareVisibility;
    passcodeHash?: string | null;
    title?: string;
    description?: string;
    tags?: string[];
    theme?: string;
  } = {},
) {
  const elementId = `el_${randomUUID()}`;
  const [presentation] = await db
    .insert(presentations)
    .values({ userId, name: "Seeded", elements: { [elementId]: element({ theme }) }, slideElements: { s1: [elementId] } })
    .returning();
  const [snippet] = await db
    .insert(snippets)
    .values({
      userId,
      presentationId: presentation.id,
      elementId,
      title,
      description,
      tags,
      isPublic: visibility === ShareVisibility.PUBLIC,
    })
    .returning();
  const [link] = await db
    .insert(shareLinks)
    .values({
      userId,
      slug: `s${randomUUID().replace(/-/g, "").slice(0, 10)}`,
      targetType: "SNIPPET",
      targetId: snippet.id,
      snippetId: snippet.id,
      presentationId: presentation.id,
      visibility,
      passcodeHash,
      indexable: visibility === ShareVisibility.PUBLIC,
    })
    .returning();
  return { presentation, snippet, link };
}
