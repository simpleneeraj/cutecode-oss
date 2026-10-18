import React, { MouseEventHandler, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Download02Icon } from "@hugeicons/core-free-icons";
import { trackExport } from "@/lib/analytics";
import { isSceneTheme, sceneExportTimeAtom } from "@/components/presets/scene";
import useHotkeys from "@/utils/useHotkeys";
import {
  CanvasSize,
  CANVAS_DIMENSIONS,
  TypingMode,
  canvasSizeAtom,
  currentSlideIdAtom,
  fileNameAtom,
  themeAtom,
  typingModeAtom,
} from "@/store/editor/editor";
import { useEditorContext } from "@/store/editor/context/editor";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Group } from "@/components/ui/group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/toast";
import { usePremiumAccess } from "@/hooks/use-premium-access";
import { AccessLevel } from "@/typings/enums";
import download from "../util/download";
import usePngClipboardSupported from "../util/usePngClipboardSupported";
import { toPng, toSvg, toBlob } from "../lib/image";
import { withFrozenScene, type VideoSize } from "../lib/animation";
import { VideoEncoderChoice, encodeGif, encodeVideo, pickVideoEncoder } from "../lib/encoders";
import ExportProgress from "./export-progress";
import ExportPanel from "./panel";
import { dockPopup } from "../controls/dock-styles";
import { VideoFormat } from "./panel/enums";
import type { VideoFormatOption } from "./panel/types";
import useExportScale from "./panel/use-export-scale";
import useVideoClips from "./use-video-clips";

const GIF_FORMAT: VideoFormatOption = { value: VideoFormat.Gif, label: "GIF", extension: "gif", fps: 20, pixelRatio: 1 };

const VIDEO_FPS = 24;
const PORTRAIT_VIDEO_FPS = 30;
const VIDEO_PIXEL_RATIO = 2;

function getVideoSize(canvasSize: CanvasSize): VideoSize | null {
  if (canvasSize === CanvasSize.Auto) return null;
  const { exportWidth, exportHeight } = CANVAS_DIMENSIONS[canvasSize];
  return { width: exportWidth, height: exportHeight };
}

function getVideoFormats(encoder: VideoEncoderChoice | null | undefined, canvasSize: CanvasSize): VideoFormatOption[] {
  if (!encoder) return [GIF_FORMAT];
  const video = {
    value: VideoFormat.Video,
    label: "MP4",
    extension: "mp4",
    fps: canvasSize === CanvasSize.Portrait ? PORTRAIT_VIDEO_FPS : VIDEO_FPS,
    pixelRatio: VIDEO_PIXEL_RATIO,
  };
  return [GIF_FORMAT, video];
}

type AnimatedExport = {
  label: string;
  progress: number;
  frame: HTMLCanvasElement | null;
  slideLabel: string | null;
};

function createFileStamp() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 8).replaceAll(":", "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${date}-${time}-${suffix}`;
}

function rejectOnAbort(signal: AbortSignal) {
  return new Promise<never>((_, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });
}

const ExportButton: React.FC = () => {
  const { frameRefs } = useEditorContext();
  const slideId = useAtomValue(currentSlideIdAtom);

  const getCurrentFrame = () => {
    const frame = frameRefs.current.get(slideId!);
    if (!frame) throw new Error("Couldn't find a frame to export");
    return frame;
  };

  const pngClipboardSupported = usePngClipboardSupported();
  const customFileName = useAtomValue(fileNameAtom);
  const exportSize = useExportScale();
  const { checkAccess } = usePremiumAccess();
  const isPlanLoading = checkAccess("watermarkRemoval") === AccessLevel.LOADING;
  const isWatermarked = checkAccess("watermarkRemoval") !== AccessLevel.ALLOWED;
  const theme = useAtomValue(themeAtom);
  const setSceneTime = useSetAtom(sceneExportTimeAtom);
  const canvasSize = useAtomValue(canvasSizeAtom);
  const typingMode = useAtomValue(typingModeAtom);
  const videoClips = useVideoClips();
  const [animatedExport, setAnimatedExport] = useState<AnimatedExport | null>(null);
  const [videoEncoder, setVideoEncoder] = useState<VideoEncoderChoice | null | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const isVideoAvailable = isSceneTheme(theme.id) || typingMode !== TypingMode.Off;
  const videoFormats = getVideoFormats(videoEncoder, canvasSize);
  const baseName = customFileName.replace(/\.[^.]+$/, "").replaceAll(" ", "-") || "coolsnippets";
  const uniqueFileName = (extension: string) => `${baseName}-${createFileStamp()}.${extension}`;

  const notifyPlanLoading = () => {
    toast.info("Checking your plan, try again in a moment");
  };

  const savePng = async () => {
    if (isPlanLoading) return notifyPlanLoading();
    const frame = getCurrentFrame();
    const toastId = toast.loading("Exporting PNG…");
    const dataUrl = await withFrozenScene(setSceneTime, () => toPng(frame, { pixelRatio: exportSize }));
    download(dataUrl, uniqueFileName("png"));
    toast.dismiss(toastId);
    trackExport.pngSaved(baseName, exportSize);
  };

  const copyPng = async () => {
    if (isPlanLoading) return notifyPlanLoading();
    const frame = getCurrentFrame();
    const toastId = toast.loading("Copying PNG…");
    const clipboardItem = new ClipboardItem({
      "image/png": withFrozenScene(setSceneTime, () => toBlob(frame, { pixelRatio: exportSize })).then((blob) => {
        if (!blob) throw new Error("expected toBlob to return a blob");
        return blob;
      }),
    });
    await navigator.clipboard.write([clipboardItem]);
    toast.success("PNG copied to clipboard!", { id: toastId });
    trackExport.pngCopied(exportSize);
  };

  const saveSvg = async () => {
    if (isPlanLoading) return notifyPlanLoading();
    const frame = getCurrentFrame();
    const toastId = toast.loading("Exporting SVG…");
    const dataUrl = await withFrozenScene(setSceneTime, () => toSvg(frame));
    download(dataUrl, uniqueFileName("svg"));
    toast.dismiss(toastId);
    trackExport.svgSaved(baseName);
  };

  const updateAnimatedExport = (patch: Partial<AnimatedExport>) => {
    setAnimatedExport((current) => current && { ...current, ...patch });
  };

  const getEncoderSize = (): VideoSize | null => {
    const fixedSize = getVideoSize(canvasSize);
    const frame = slideId ? frameRefs.current.get(slideId) : null;
    if (fixedSize || !frame) return fixedSize;
    const pixelRatio = checkAccess("hdVideo") === AccessLevel.ALLOWED ? VIDEO_PIXEL_RATIO : 1;
    return { width: Math.ceil(frame.offsetWidth * pixelRatio), height: Math.ceil(frame.offsetHeight * pixelRatio) };
  };

  const detectVideoEncoder = (isOpen: boolean) => {
    if (isOpen) pickVideoEncoder(getEncoderSize()).then(setVideoEncoder);
  };

  const encodeClips = (format: VideoFormat, ...args: Parameters<typeof encodeGif>) => {
    if (format === VideoFormat.Video && videoEncoder) return encodeVideo(...args, videoEncoder);
    return encodeGif(...args);
  };

  const saveAnimation = async (format: VideoFormat, isReel: boolean) => {
    const option = videoFormats.find(({ value }) => value === format);
    if (!option) return;
    if (isPlanLoading) return notifyPlanLoading();
    const isVideo = format === VideoFormat.Video;
    const isHd = checkAccess("hdVideo") === AccessLevel.ALLOWED;
    const controller = new AbortController();
    const restoreSelection = videoClips.saveSelection();
    abortRef.current = controller;
    setAnimatedExport({ label: isReel ? `${option.label} reel` : option.label, progress: 0, frame: null, slideLabel: null });
    try {
      const clips = isReel
        ? videoClips.slideClips((index, count) => updateAnimatedExport({ slideLabel: `Slide ${index + 1} of ${count}` }))
        : [videoClips.currentClip()];
      const encoding = encodeClips(format, clips, {
        fps: option.fps,
        pixelRatio: isHd ? option.pixelRatio : 1,
        size: isVideo ? getVideoSize(canvasSize) : null,
        setTime: setSceneTime,
        signal: controller.signal,
        isWatermarked,
        onProgress: (progress, preview) => updateAnimatedExport(preview ? { progress, frame: preview } : { progress }),
      });
      encoding.catch(() => undefined);
      const blob = await Promise.race([encoding, rejectOnAbort(controller.signal)]);
      download(blob, uniqueFileName(option.extension));
      toast.success(`${option.label} saved`);
    } catch (error) {
      if (controller.signal.aborted) return;
      toast.error(error instanceof Error ? error.message : `Couldn't export ${option.label}`);
    } finally {
      abortRef.current = null;
      restoreSelection();
      setSceneTime(null);
      setAnimatedExport(null);
    }
  };

  const handleExportClick: MouseEventHandler = (event) => {
    event.preventDefault();
    savePng();
  };

  useHotkeys("ctrl+s,cmd+s", (event) => {
    event.preventDefault();
    savePng();
  });
  useHotkeys("ctrl+c,cmd+c", (event) => {
    const hasSelectedText = Boolean(window.getSelection()?.toString());
    if (!pngClipboardSupported || hasSelectedText) return;
    if (isPlanLoading) return notifyPlanLoading();
    event.preventDefault();
    copyPng();
  });
  useHotkeys("ctrl+shift+c,cmd+shift+c", (event) => {
    event.preventDefault();
  });
  useHotkeys("ctrl+shift+s,cmd+shift+s", (event) => {
    event.preventDefault();
    saveSvg();
  });

  return (
    <>
      <Group aria-label="Export actions">
        <Button variant="outline" aria-label="Export" onClick={handleExportClick}>
          <HugeiconsIcon icon={Download02Icon} className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Separator orientation="vertical" />
        <Popover onOpenChange={detectVideoEncoder}>
          <PopoverTrigger render={<Button aria-label="Export options" size="icon" variant="outline" />}>
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" aria-hidden="true" />
          </PopoverTrigger>

          <PopoverPopup tooltipStyle className={dockPopup({ className: "w-80 rounded-2xl text-sm text-wrap" })}>
            <div className="flex flex-col gap-2 py-1">
              <ExportPanel
                onDownloadPng={savePng}
                onCopyPng={copyPng}
                onDownloadSvg={saveSvg}
                onExportVideo={saveAnimation}
                videoFormats={videoFormats}
                isVideoAvailable={isVideoAvailable}
                isExporting={animatedExport !== null}
              />
              {isVideoAvailable && videoEncoder === null && (
                <p className="px-1 text-muted-foreground text-xs">Use Chrome or Safari for video</p>
              )}
            </div>
          </PopoverPopup>
        </Popover>
      </Group>
      <ExportProgress
        label={animatedExport?.label ?? null}
        slideLabel={animatedExport?.slideLabel ?? null}
        progress={animatedExport?.progress ?? 0}
        frame={animatedExport?.frame ?? null}
        hasWatermark={isWatermarked}
        onCancel={() => abortRef.current?.abort()}
      />
    </>
  );
};

export default ExportButton;
