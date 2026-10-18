import { getFontEmbedCSS, toCanvas } from "html-to-image";
import { imageFilter } from "./image";
import { canPaintCode, paintCode } from "./code-painter";
import {
  EXACT_TOLERANCE,
  TEXT_TOLERANCE,
  compose,
  createBaseFilter,
  findLayers,
  isWithin,
  measureDifference,
  placeLayer,
  regionOf,
  type FrameLayers,
  type PlacedLayer,
} from "./layers";
import { logDev, nextFrame, timed, withTimeout } from "./timing";

export enum CaptureMode {
  Full = "full",
  PaintedCode = "painted-code",
  CapturedCode = "captured-code",
}

export type CapturedFrame = {
  canvas: HTMLCanvasElement;
  isRepeat: boolean;
};

export type ClipScene = {
  node: HTMLElement;
  isScene: boolean;
  pixelRatio: number;
  setTime: (time: number) => void;
};

type Renderer = {
  mode: CaptureMode;
  render: () => Promise<CapturedFrame>;
};

type CanvasOptions = { pixelRatio: number; fontEmbedCSS: string };

type LayeredSetup = {
  scene: ClipScene;
  layers: FrameLayers;
  canvasOptions: CanvasOptions;
  codeOptions: CanvasOptions;
  mode: CaptureMode;
};

export async function settle() {
  await nextFrame();
  await nextFrame();
}

function createCodeDrawer({ scene, layers, codeOptions, mode }: LayeredSetup) {
  const canvas = document.createElement("canvas");
  return async () => {
    const { codeBlock } = layers;
    if (mode === CaptureMode.PaintedCode) {
      paintCode(codeBlock, canvas, scene.pixelRatio);
      return placeLayer(scene.node, codeBlock, canvas, scene.pixelRatio);
    }
    const captured = await toCanvas(codeBlock, { ...codeOptions, filter: imageFilter });
    return placeLayer(scene.node, codeBlock, captured, scene.pixelRatio);
  };
}

async function captureOverlays({ scene, layers, canvasOptions }: LayeredSetup) {
  const captures = layers.overlays.map(async (overlay) => {
    const canvas = await toCanvas(overlay, { ...canvasOptions, filter: imageFilter });
    return placeLayer(scene.node, overlay, canvas, scene.pixelRatio);
  });
  return Promise.all(captures);
}

async function createLayeredRenderer(setup: LayeredSetup): Promise<Renderer> {
  const { scene, layers, canvasOptions, mode } = setup;
  const baseOptions = { ...canvasOptions, filter: createBaseFilter(layers) };
  const captureBase = () => toCanvas(scene.node, baseOptions);
  const staticBase = scene.isScene ? null : await captureBase();
  const overlays = await captureOverlays(setup);
  const drawCode = createCodeDrawer(setup);
  const output = document.createElement("canvas");
  let codeKey: string | null = null;
  let codeLayer: PlacedLayer | null = null;

  const render = async () => {
    const key = layers.codeBlock.innerHTML;
    const isCodeChanged = key !== codeKey || !codeLayer;
    if (staticBase && !isCodeChanged) return { canvas: output, isRepeat: true };
    const base = staticBase ?? (await captureBase());
    if (isCodeChanged) codeLayer = await drawCode();
    codeKey = key;
    compose(output, base, codeLayer ? [codeLayer, ...overlays] : overlays);
    return { canvas: output, isRepeat: false };
  };
  return { mode, render };
}

const FULL_CAPTURE_TIMEOUT_MS = 30_000;

function createFullRenderer(scene: ClipScene, canvasOptions: CanvasOptions): Renderer {
  const options = { ...canvasOptions, filter: imageFilter };
  const render = async () => {
    const canvas = await withTimeout(toCanvas(scene.node, options), FULL_CAPTURE_TIMEOUT_MS, "A video frame didn't render");
    return { canvas, isRepeat: false };
  };
  return { mode: CaptureMode.Full, render };
}

async function renderWith(setup: LayeredSetup) {
  const renderer = await createLayeredRenderer(setup);
  const { canvas } = await renderer.render();
  return { renderer, canvas };
}

async function findMatchingRenderer(scene: ClipScene, layers: FrameLayers, canvasOptions: CanvasOptions) {
  const codeFontCSS = await getFontEmbedCSS(layers.codeBlock, { filter: imageFilter });
  const setup = { scene, layers, canvasOptions, codeOptions: { ...canvasOptions, fontEmbedCSS: codeFontCSS } };
  const { result: reference, elapsedMs } = await timed(() => toCanvas(scene.node, { ...canvasOptions, filter: imageFilter }));
  const wholeFrame = { x: 0, y: 0, width: reference.width, height: reference.height };
  const captured = await renderWith({ ...setup, mode: CaptureMode.CapturedCode });
  const capturedDifference = measureDifference(reference, captured.canvas, wholeFrame);
  logDev(`full capture ${elapsedMs.toFixed(1)}ms, captured code difference`, capturedDifference);
  if (!isWithin(capturedDifference, EXACT_TOLERANCE)) return null;
  if (!canPaintCode(layers.codeBlock)) return { renderer: captured.renderer, reference };

  const painted = await renderWith({ ...setup, mode: CaptureMode.PaintedCode });
  const codeRegion = regionOf(scene.node, layers.codeBlock, scene.pixelRatio);
  const paintedDifference = measureDifference(reference, painted.canvas, codeRegion);
  logDev("painted code difference", paintedDifference);
  const renderer = isWithin(paintedDifference, TEXT_TOLERANCE) ? painted.renderer : captured.renderer;
  return { renderer, reference };
}

export async function prepareRenderer(scene: ClipScene, referenceTimeMs: number) {
  scene.setTime(0);
  await settle();
  const fontEmbedCSS = await getFontEmbedCSS(scene.node, { filter: imageFilter });
  const canvasOptions = { pixelRatio: scene.pixelRatio, fontEmbedCSS };
  await toCanvas(scene.node, { ...canvasOptions, filter: imageFilter });
  const layers = findLayers(scene.node);
  if (!layers) return { renderer: createFullRenderer(scene, canvasOptions), palette: null };

  scene.setTime(referenceTimeMs);
  await settle();
  const match = await findMatchingRenderer(scene, layers, canvasOptions);
  if (!match) return { renderer: createFullRenderer(scene, canvasOptions), palette: null };
  const palette = scene.isScene ? null : match.reference;
  return { renderer: match.renderer, palette };
}
