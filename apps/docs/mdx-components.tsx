import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/docs-mdx/callout";
import { DocsCodeBlock } from "@/components/docs-mdx/code-block";

export function getMdxComponents(): MDXComponents {
  return { ...defaultMdxComponents, Callout, pre: DocsCodeBlock };
}
