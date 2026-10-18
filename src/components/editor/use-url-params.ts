import { atom, useAtomValue, type Getter, type Setter } from "jotai";
import { createJSONStorage } from "jotai/utils";
import { themes } from "@/components/presets/themes";
import { preloadPreset } from "@/components/presets";
import { isPristineCode, themeChangeUpdate } from "@/components/presets/themes/samples";
import { findSnippet, isSnippetLanguage, snippetPatch } from "@/components/presets/snippets";
import { LANGUAGES } from "@/components/editor/util/languages";
import { PADDING_OPTIONS } from "@/components/editor/controls/padding";
import {
  CanvasSize,
  StoreKey,
  canvasSizeAtom,
  currentElementIdAtom,
  currentSlideIdAtom,
  editorAtom,
  elementThemeAtom,
  highlightReadyAtom,
  elementContentAtom,
  elementIsSampleCodeAtom,
  previewThemeAtom,
  updateSlideElementAtom,
  videoLengthMsAtom,
} from "@/store/editor/editor";
import { locationAtom } from "@/store/editor/plans";
import { trackLink } from "@/lib/analytics";
import { BadgeVariant, InitialValues, type EditorState, type ElementType } from "@/typings/editor";
import initialState from "@/store/editor/editor/state";
import { RENDER_LENGTH_MS, isRenderMode } from "./lib/render-mode";

const REVEAL_TIMEOUT_MS = 600;

const assetsReadyAtom = atom(false);
const forceRevealAtom = atom(false);
const storage = createJSONStorage<unknown>();

const URL_PARAMS = ["theme", "code", "lang", "dark", "padding", "size", "ref", "render"];

function decodeCode(value: string | null) {
  if (!value) return undefined;
  try {
    const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));
    return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
  } catch {
    return undefined;
  }
}

function languageName(id: string | null) {
  return id ? LANGUAGES[id]?.name : undefined;
}

function darkMode(value: string | null) {
  if (value === "1") return true;
  if (value === "0") return false;
  return undefined;
}

function padding(value: string | null) {
  return PADDING_OPTIONS.find((option) => option.value === `${value}px`)?.value;
}

function canvasSize(value: string | null) {
  return Object.values(CanvasSize).find((size) => size === value);
}

function languagePatch(content: unknown, name: string): Partial<ElementType> {
  const snippet = findSnippet(content);
  return snippet && isSnippetLanguage(name) ? snippetPatch(snippet, name) : { properties: { language: name } };
}

function applyParams(get: Getter, set: Setter, params: URLSearchParams) {
  const renderMode = isRenderMode();
  const theme = themes[params.get("theme") ?? ""];
  const code = decodeCode(params.get("code"));
  const canReplaceCode =
    renderMode ||
    (code === undefined && (get(elementIsSampleCodeAtom) || isPristineCode(get(elementContentAtom))));
  const usesThemeSample = !!theme?.sample && canReplaceCode;

  if (theme) set(updateSlideElementAtom, themeChangeUpdate(theme, canReplaceCode));
  if (theme?.tags?.includes(BadgeVariant.PREMIUM)) {
    set(previewThemeAtom, { elementId: get(currentElementIdAtom) ?? "", themeId: theme.id });
  }
  if (code !== undefined) set(updateSlideElementAtom, { content: code, properties: { isSampleCode: false } });

  const language = languageName(params.get("lang"));
  const keepsSampleLanguage = usesThemeSample && !findSnippet(get(elementContentAtom));
  if (language && !keepsSampleLanguage) set(updateSlideElementAtom, languagePatch(get(elementContentAtom), language));

  const dark = darkMode(params.get("dark"));
  if (dark !== undefined) set(updateSlideElementAtom, { properties: { darkMode: dark } });
  const space = padding(params.get("padding"));
  if (space) set(updateSlideElementAtom, { style: { padding: space } });

  const size = renderMode ? CanvasSize.Landscape : canvasSize(params.get("size"));
  if (size) set(canvasSizeAtom, size);
  if (renderMode) set(videoLengthMsAtom, RENDER_LENGTH_MS);

  const ref = params.get("ref");
  if (ref) trackLink.opened(ref.slice(0, 32), theme?.id ?? "", code !== undefined);
}

function withoutUrlParams(params: URLSearchParams) {
  const remaining = new URLSearchParams(params);
  for (const key of URL_PARAMS) remaining.delete(key);
  return remaining;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function loadAssets(themeId: string) {
  return Promise.all([preloadPreset(themeId), nextFrame().then(() => document.fonts.ready)]).catch(() => undefined);
}

function hydrateFromStorage(set: Setter) {
  set(editorAtom, storage.getItem(StoreKey.SLIDES, initialState) as EditorState);
  set(currentSlideIdAtom, storage.getItem(StoreKey.CURRENT_SLIDE_ID, InitialValues.SLIDE_ID) as string | null);
  set(currentElementIdAtom, storage.getItem(StoreKey.CURRENT_ELEMENT_ID, InitialValues.ELEMENT_ID) as string | null);
}

const editorRevealAtom = atom(
  (get) => get(forceRevealAtom) || (get(assetsReadyAtom) && get(highlightReadyAtom)),
  (get, set) => {
    const params = new URLSearchParams(window.location.search);
    if (!URL_PARAMS.some((key) => params.has(key))) return set(forceRevealAtom, true);

    hydrateFromStorage(set);
    applyParams(get, set, params);
    if (!isRenderMode()) set(locationAtom, { searchParams: withoutUrlParams(params) });
    setTimeout(() => set(forceRevealAtom, true), REVEAL_TIMEOUT_MS);
    loadAssets(get(elementThemeAtom)).then(() => set(assetsReadyAtom, true));
  },
);
editorRevealAtom.onMount = (reveal) => reveal();

export default function useUrlParams() {
  return useAtomValue(editorRevealAtom);
}
