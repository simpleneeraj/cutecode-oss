"use client";

import View from "@/components/view";
import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import { PresetFrame } from "@/components/presets";
import Editor from "@/components/editor/textarea";
import fonts from "@/fonts/editor/fonts";
import styles from "@/styles/editor/Frame.module.css";

type RawElement = Record<string, unknown>;

type SnippetFrameProps = {
  elementId: string;
  element: RawElement;
  windowWidth: number;
};

export function SnippetFrame({ elementId, element, windowWidth }: SnippetFrameProps) {
  const props = element.properties as Record<string, unknown> | undefined;
  const style = element.style as Record<string, unknown> | undefined;
  const header = element.header as { properties?: { title?: { text?: string } } } | undefined;
  const themeId = (props?.theme as string) || "default";
  const codeFont = fonts.find((font) => font.name === style?.fontFamily);
  const frameStyle: Record<string, string> = codeFont ? { "--code-font": `var(${codeFont.variable})` } : {};

  const frameProps: BaseFrameProps = {
    padding: style?.padding ? parseInt(style.padding as string) : 32,
    darkMode: (props?.darkMode as boolean) ?? true,
    transparent: (props?.transparent as boolean) ?? true,
    themeBackground: (style?.background as string) || "",
    fileName: header?.properties?.title?.text || "snippet",
    selectedLanguage: {
      name: (props?.language as string) || "TypeScript",
      value: (props?.language as string)?.toLowerCase() || "typescript",
    },
    windowWidth,
    exportSize: 2,
    themeId,
    onFileNameChange: () => {},
  };

  return (
    <View className="relative flex justify-center-safe overflow-x-auto">
      <div className={cn(styles.outerFrame, "rounded-2xl")} data-canvas-size="auto" style={frameStyle}>
        <PresetFrame key={elementId} {...frameProps}>
          <Editor previewData={element} />
        </PresetFrame>
      </div>
    </View>
  );
}
