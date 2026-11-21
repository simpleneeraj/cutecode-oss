import { Button } from "@cutecode/ui/components/button";
import { AppIcon } from "@cutecode/ui/tactile/app-icon";
import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import Link from "next/link";

import { homeSectionStyles } from "@/components/home/section/style";
import { SectionHeading } from "@/components/home/section-heading";
import { siteLinks } from "@/components/site-header/constants";

import { docLinks } from "./constants";
import { DocsPreview } from "./docs-preview";
import { docsTeaserStyles } from "./style";

const section = homeSectionStyles();
const styles = docsTeaserStyles();

export function DocsTeaser() {
  return (
    <section className={section.root()} id="docs">
      <div className={section.feature()}>
        <SectionHeading
          eyebrow="Docs"
          lead="Play with the preview, switch the style, copy the code, read the props. No sandbox to open."
          title="Every part, live on the page."
        >
          <Button render={<Link href={siteLinks.docs} />}>Read the docs</Button>
        </SectionHeading>
        <DocsPreview />
      </div>
      <nav aria-label="Docs" className={styles.links()}>
        {docLinks.map((link) => (
          <Link className={styles.link()} href={link.href} key={link.id}>
            <AppIcon icon={link.icon} size={AppIconSize.Small} />
            <span className={styles.linkText()}>
              <span className={styles.linkTitle()}>{link.title}</span>
              <span className={styles.linkLine()}>{link.line}</span>
            </span>
            <AltArrowRightIcon aria-hidden="true" className={styles.linkIcon()} />
          </Link>
        ))}
      </nav>
    </section>
  );
}
