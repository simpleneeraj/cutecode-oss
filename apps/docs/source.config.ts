import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { createCssVariablesTheme } from "shiki";

export const docs = defineDocs({ dir: "content/docs" });

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: createCssVariablesTheme() },
      defaultColor: "light",
    },
  },
});
