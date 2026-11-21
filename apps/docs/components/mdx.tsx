import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/docs-mdx/callout";
import { DocsCodeBlock } from "@/components/docs-mdx/code-block";
import { DocsHeading } from "@/components/docs-mdx/heading";
import { HeadingLevel } from "@/components/docs-mdx/heading-level";

function headingFor(level: HeadingLevel) {
  return function Heading(props: ComponentProps<"h2">) {
    return <DocsHeading level={level} {...props} />;
  };
}

const headings = {
  h1: headingFor(HeadingLevel.One),
  h2: headingFor(HeadingLevel.Two),
  h3: headingFor(HeadingLevel.Three),
  h4: headingFor(HeadingLevel.Four),
  h5: headingFor(HeadingLevel.Five),
  h6: headingFor(HeadingLevel.Six),
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Callout,
    pre: DocsCodeBlock,
    ...headings,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
