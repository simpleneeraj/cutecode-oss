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
    properties: { language: sample.language },
    header: { properties: { title: { text: sample.fileName, icon: sample.icon } } },
  };
}
