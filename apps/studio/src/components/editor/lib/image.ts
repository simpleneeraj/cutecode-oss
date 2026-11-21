import { toPng as htmlToPng, toSvg as htmlToSvg, toBlob as htmlToBlob } from "html-to-image";

export const imageFilter = (node: HTMLElement) => node.tagName !== "TEXTAREA" && !node.dataset?.ignoreInExport;

const isSafari =
  typeof navigator !== "undefined" &&
  navigator.userAgent.indexOf("Safari") > -1 &&
  navigator.userAgent.indexOf("Chrome") <= -1;

const SAFARI_MAX_PIXEL_RATIO = 2;

const htmlToImageOptions = {
  filter: imageFilter,
  pixelRatio: 2,
};

export async function prepareFonts() {
  if (typeof document !== "undefined" && typeof document.fonts?.ready !== "undefined") {
    await document.fonts.ready;
  }
}

function resolvePixelRatio(pixelRatio?: number) {
  const base = pixelRatio ?? htmlToImageOptions.pixelRatio;
  return isSafari ? Math.min(base, SAFARI_MAX_PIXEL_RATIO) : base;
}

type PngOptions = Parameters<typeof htmlToPng>[1];
export const toPng = async (node: HTMLElement, options?: PngOptions) => {
  await prepareFonts();
  const pixelRatio = resolvePixelRatio(options?.pixelRatio);
  // sometimes the first render doesn't work fully so we do the rendering twice https://github.com/bubkoo/html-to-image/issues/361
  await htmlToPng(node, { ...htmlToImageOptions, ...options, pixelRatio });
  return htmlToPng(node, { ...htmlToImageOptions, ...options, pixelRatio });
};

type BlobOptions = Parameters<typeof htmlToBlob>[1];
export const toBlob = async (node: HTMLElement, options?: BlobOptions) => {
  await prepareFonts();
  const pixelRatio = resolvePixelRatio(options?.pixelRatio);
  return htmlToBlob(node, { ...htmlToImageOptions, ...options, pixelRatio });
};

type SvgOptions = Parameters<typeof htmlToSvg>[1];
export const toSvg = async (node: HTMLElement, options?: SvgOptions) => {
  await prepareFonts();
  return htmlToSvg(node, { ...htmlToImageOptions, ...options });
};
