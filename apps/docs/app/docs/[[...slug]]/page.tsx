import { DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";

import { CopyPageButton } from "../_chrome/copy-page-button";
import { DocsPageShell } from "../_chrome/docs-page-shell";
import { chromeStyles } from "../_chrome/style";

type DocsPageProps = {
  params: Promise<{ slug?: string[] }>;
};

const styles = chromeStyles();

export default async function Page({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  const isMissing = page === undefined;
  if (isMissing) {
    notFound();
  }

  const Content = page.data.body;
  const markdown = await page.data.getText("processed");

  return (
    <DocsPageShell isFull={page.data.full ?? false} toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className={styles.links()}>
        <CopyPageButton markdown={markdown} />
      </div>
      <DocsBody>
        <Content components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPageShell>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  const isMissing = page === undefined;
  if (isMissing) {
    notFound();
  }

  return { title: page.data.title, description: page.data.description };
}
