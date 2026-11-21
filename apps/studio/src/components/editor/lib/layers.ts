import { imageFilter } from "./image";

export type FrameLayers = {
  codeBlock: HTMLElement;
  overlays: HTMLElement[];
};

export type PlacedLayer = {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
};

export type Region = { x: number; y: number; width: number; height: number };

export type Tolerance = { mean: number; strays: number };

export const EXACT_TOLERANCE: Tolerance = { mean: 0.5, strays: 0.001 };
export const TEXT_TOLERANCE: Tolerance = { mean: 3, strays: 0.03 };

const STRAY_CHANNEL_DIFFERENCE = 64;

export function getContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D context is unavailable");
  return context;
}

function isVisibleBlock(element: Element): element is HTMLDivElement {
  return element instanceof HTMLDivElement && getComputedStyle(element).visibility !== "hidden";
}

export function findLayers(frame: HTMLElement): FrameLayers | null {
  const textareas = frame.querySelectorAll("textarea");
  const editor = textareas.length === 1 ? textareas[0].parentElement : null;
  if (!editor) return null;
  const codeBlocks = Array.from(editor.children).filter(isVisibleBlock);
  if (codeBlocks.length !== 1) return null;
  const overlays = Array.from(frame.querySelectorAll<HTMLElement>("[data-export-overlay]"));
  return { codeBlock: codeBlocks[0], overlays };
}

export function createBaseFilter({ codeBlock, overlays }: FrameLayers) {
  return (node: HTMLElement) =>
    imageFilter(node) && node.parentElement !== codeBlock && !overlays.includes(node);
}

export function placeLayer(frame: HTMLElement, node: HTMLElement, canvas: HTMLCanvasElement, pixelRatio: number) {
  const frameRect = frame.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  const scale = (frame.offsetWidth / frameRect.width) * pixelRatio;
  return { canvas, x: (rect.left - frameRect.left) * scale, y: (rect.top - frameRect.top) * scale };
}

export function compose(target: HTMLCanvasElement, base: HTMLCanvasElement, layers: PlacedLayer[]) {
  if (target.width !== base.width) target.width = base.width;
  if (target.height !== base.height) target.height = base.height;
  const context = getContext(target);
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(base, 0, 0);
  layers.forEach(({ canvas, x, y }) => context.drawImage(canvas, x, y));
}

export function regionOf(frame: HTMLElement, node: HTMLElement, pixelRatio: number): Region {
  const { x, y } = placeLayer(frame, node, document.createElement("canvas"), pixelRatio);
  const width = node.offsetWidth * pixelRatio;
  const height = node.offsetHeight * pixelRatio;
  return { x: Math.floor(x), y: Math.floor(y), width: Math.ceil(width), height: Math.ceil(height) };
}

const pixelsOf = (canvas: HTMLCanvasElement, { x, y, width, height }: Region) =>
  getContext(canvas).getImageData(x, y, width, height).data;

export function measureDifference(first: HTMLCanvasElement, second: HTMLCanvasElement, region: Region) {
  if (first.width !== second.width || first.height !== second.height) return { mean: Infinity, strays: 1 };
  const a = pixelsOf(first, region);
  const b = pixelsOf(second, region);
  let total = 0;
  let strays = 0;
  for (let index = 0; index < a.length; index += 1) {
    const difference = Math.abs(a[index] - b[index]);
    total += difference;
    if (difference > STRAY_CHANNEL_DIFFERENCE) strays += 1;
  }
  return { mean: total / a.length, strays: strays / a.length };
}

export const isWithin = (difference: Tolerance, tolerance: Tolerance) =>
  difference.mean <= tolerance.mean && difference.strays <= tolerance.strays;
