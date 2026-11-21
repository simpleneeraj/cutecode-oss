import { ElementType, Theme } from "@/typings/editor";
import { createDefaultElement } from "@/store/editor/editor/state";
import { themes } from "./index";

export function isPristineCode(content: unknown) {
  if (content === createDefaultElement().content) return true;
  return Object.values(themes).some(({ sample }) => sample !== undefined && sample.code === content);
}

export function sampleUpdate({ sample }: Theme): Partial<ElementType> {
  if (!sample) return {};
  return {
    content: sample.code,
    properties: { language: sample.language, isSampleCode: true },
    header: { properties: { title: { text: sample.fileName, icon: sample.icon } } },
  };
}

export function themeChangeUpdate(theme: Theme, canReplaceCode: boolean): Partial<ElementType> {
  if (!theme.sample || !canReplaceCode) return { properties: { theme: theme.id } };
  const sample = sampleUpdate(theme);
  return { ...sample, properties: { ...sample.properties, theme: theme.id } };
}
