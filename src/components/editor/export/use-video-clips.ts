import { useStore } from "jotai";
import { isSceneTheme } from "@/components/presets/scene";
import { useEditorContext } from "@/store/editor/context/editor";
import {
  currentElementIdAtom,
  currentSlideIdAtom,
  elementThemeAtom,
  selectSlideAtom,
  slidesAtom,
  videoDurationMsAtom,
} from "@/store/editor/editor";
import type { MountedClip, VideoClip } from "../lib/animation";

const HIGHLIGHT_SETTLE_MS = 150;
const SLIDE_MOUNT_TIMEOUT_MS = 15_000;

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const shownThemeOf = (frame: HTMLElement) =>
  frame.querySelector<HTMLElement>("[data-shown-theme]")?.dataset.shownTheme;

async function settleFrame() {
  await nextFrame();
  await nextFrame();
  await document.fonts.ready;
  await wait(HIGHLIGHT_SETTLE_MS);
}

export default function useVideoClips() {
  const store = useStore();
  const { frameRefs } = useEditorContext();

  const findFrame = (slideId: string, themeId: string) => {
    const frame = frameRefs.current.get(slideId);
    return frame?.isConnected && shownThemeOf(frame) === themeId ? frame : null;
  };

  const waitForFrame = async (slideId: string, themeId: string) => {
    const startedAt = performance.now();
    while (performance.now() - startedAt < SLIDE_MOUNT_TIMEOUT_MS) {
      if (findFrame(slideId, themeId)) {
        await settleFrame();
        const frame = findFrame(slideId, themeId);
        if (frame) return frame;
      }
      await nextFrame();
    }
    throw new Error("Couldn't show the next slide");
  };

  const mountSlide = async (slideId: string): Promise<MountedClip> => {
    const themeId = store.get(elementThemeAtom);
    const node = await waitForFrame(slideId, themeId);
    return { node, isScene: isSceneTheme(themeId) };
  };

  const saveSelection = () => {
    const slideId = store.get(currentSlideIdAtom);
    const elementId = store.get(currentElementIdAtom);
    return () => {
      store.set(currentSlideIdAtom, slideId);
      store.set(currentElementIdAtom, elementId);
    };
  };

  const currentClip = (): VideoClip => {
    const slideId = store.get(currentSlideIdAtom);
    if (!slideId) throw new Error("Couldn't find a frame to export");
    return { durationMs: store.get(videoDurationMsAtom), mount: () => mountSlide(slideId) };
  };

  const slideClips = (onSlide: (index: number, count: number) => void): VideoClip[] => {
    const slideIds = store.get(slidesAtom).map((slide) => slide.id);
    const restoreSelection = saveSelection();
    const clips = slideIds.map((slideId, index) => {
      store.set(selectSlideAtom, slideId);
      const mount = () => {
        onSlide(index, slideIds.length);
        store.set(selectSlideAtom, slideId);
        return mountSlide(slideId);
      };
      return { durationMs: store.get(videoDurationMsAtom), mount };
    });
    restoreSelection();
    return clips;
  };

  return { saveSelection, currentClip, slideClips };
}
