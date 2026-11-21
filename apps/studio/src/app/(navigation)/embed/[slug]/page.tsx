import { Metadata } from "next";
import EmbedSnippetClient from "./page.client";

export const metadata: Metadata = {
  title: "Embed Snippet",
  description:
    "Embed this code snippet anywhere — blogs, docs, or websites. Beautiful syntax highlighting powered by CuteCode.",
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return [];
}

const EmbedSnippet = () => <EmbedSnippetClient />;

export default EmbedSnippet;
