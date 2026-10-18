import { z } from "zod";

// ─────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const LIMITS = {
  tagLength: 32,
  tags: 8,
  title: 120,
  description: 500,
  slideCode: 20_000,
  slides: 20,
  elementsBytes: 512 * 1024,
} as const;

const UNSAFE_CSS = /[;{}\\<>@]|(?:url|image-set|image|element|cross-fade|src|expression|paint)\s*\(/i;
const SAFE_BACKGROUND =
  /^(?:|#[0-9a-f]{3,8}|[a-z]+|(?:rgb|hsl)a?\([^()]*\)|(?:repeating-)?(?:linear|radial|conic)-gradient\((?:[^()]|\([^()]*\))*\))$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeStyle(style: Record<string, unknown>) {
  return Object.entries(style).every(([key, value]) => {
    if (typeof value !== "string") return true;
    if (UNSAFE_CSS.test(value)) return false;
    return key !== "background" || SAFE_BACKGROUND.test(value.trim());
  });
}

export function hasSafeStyles(value: unknown): boolean {
  if (Array.isArray(value)) return value.every(hasSafeStyles);
  if (!isRecord(value)) return true;
  return Object.entries(value).every(([key, child]) =>
    key === "style" && isRecord(child) ? isSafeStyle(child) && hasSafeStyles(child) : hasSafeStyles(child),
  );
}

function elementCodeLength(element: unknown) {
  if (!isRecord(element)) return 0;
  return [element.content, element.code].reduce<number>((total, code) => total + (typeof code === "string" ? code.length : 0), 0);
}

export const tagsSchema = z.array(z.string().trim().max(LIMITS.tagLength)).max(LIMITS.tags);
export const titleSchema = z.string().max(LIMITS.title);
export const descriptionSchema = z.string().max(LIMITS.description);

export const elementsSchema = z
  .record(z.string(), z.unknown())
  .refine((elements) => new TextEncoder().encode(JSON.stringify(elements)).length <= LIMITS.elementsBytes, {
    message: "Presentation is too large",
  })
  .refine((elements) => Object.values(elements).every((element) => elementCodeLength(element) <= LIMITS.slideCode), {
    message: `Code is limited to ${LIMITS.slideCode} characters per slide`,
  })
  .refine(hasSafeStyles, { message: "Unsupported style value" });

export const slidesSchema = z
  .record(z.string(), z.unknown())
  .refine((slides) => Object.keys(slides).length <= LIMITS.slides, { message: `At most ${LIMITS.slides} slides` })
  .refine(hasSafeStyles, { message: "Unsupported style value" });

export const slideElementsSchema = z
  .record(z.string(), z.array(z.string()))
  .refine((slideElements) => Object.keys(slideElements).length <= LIMITS.slides, { message: `At most ${LIMITS.slides} slides` });

// ─────────────────────────────────────────────
// Snippet
// ─────────────────────────────────────────────

export const createSnippetSchema = z.object({
  presentationId: z.string().min(1),
  elementId: z.string().min(1),
  title: titleSchema.optional(),
  tags: tagsSchema.optional(),
  isPublic: z.boolean().default(false),
});

export const updateSnippetSchema = z.object({
  title: titleSchema.optional(),
  tags: tagsSchema.optional(),
  isPublic: z.boolean().optional(),
});

// ─────────────────────────────────────────────
// Presentation sync
// ─────────────────────────────────────────────

export const syncPresentationSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  width: z.coerce.number().int().min(200).max(4000).optional(),
  slides: slidesSchema.default({}),
  elements: elementsSchema.default({}),
  slideElements: slideElementsSchema.default({}),
});

export const createPresentationSchema = z.object({
  name: z.string().min(1).max(120).default("Untitled"),
  width: z.coerce.number().int().min(200).max(4000).default(680),
  slides: slidesSchema.default({}),
  elements: elementsSchema.default({}),
  slideElements: slideElementsSchema.default({}),
});

// ─────────────────────────────────────────────
// Share link
// ─────────────────────────────────────────────

export const passcodeSchema = z.string().regex(/^\d{6}$/, "Passcode must be exactly 6 digits");

export const createShareLinkSchema = z
  .object({
    snippetId: z.string().optional(),
    presentationId: z.string().optional(),
    visibility: z.enum(["PUBLIC", "UNLISTED", "PASSCODE", "PRIVATE"]).default("PUBLIC"),
    passcode: passcodeSchema.optional(),
    isE2EEncrypted: z.boolean().default(false),
    encryptionHint: z.string().max(200).optional(),
    maxViews: z.number().int().min(1).optional(),
    expiresAt: z.iso.datetime().optional(),
    allowDownload: z.boolean().default(true),
    allowCopy: z.boolean().default(true),
  })
  .refine((d) => !!(d.snippetId || d.presentationId), { message: "Either snippetId or presentationId is required" })
  .refine((d) => !(d.snippetId && d.presentationId), { message: "Only one of snippetId or presentationId is allowed" })
  .refine((d) => d.visibility !== "PASSCODE" || !!d.passcode, {
    message: "passcode is required when visibility is PASSCODE",
  });

export const updateShareLinkSchema = z.object({
  visibility: z.enum(["PUBLIC", "UNLISTED", "PASSCODE", "PRIVATE"]).optional(),
  passcode: passcodeSchema.optional(),
  isE2EEncrypted: z.boolean().optional(),
  encryptionHint: z.string().max(200).optional(),
  maxViews: z.number().int().min(1).nullable().optional(),
  expiresAt: z.iso.datetime().nullable().optional(),
  allowDownload: z.boolean().optional(),
  allowCopy: z.boolean().optional(),
});

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>;
export type UpdateSnippetInput = z.infer<typeof updateSnippetSchema>;
export type SyncPresentationInput = z.infer<typeof syncPresentationSchema>;
export type CreatePresentationInput = z.infer<typeof createPresentationSchema>;
export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;
export type UpdateShareLinkInput = z.infer<typeof updateShareLinkSchema>;
