import { ArrowLink } from "@/components/home/arrow-link";
import { homeSectionStyles } from "@/components/home/section/style";
import { SectionHeading } from "@/components/home/section-heading";
import { siteLinks } from "@/components/site-header/constants";

import { ObjectTile } from "./object-tile";
import { objectsBentoStyles } from "./style";
import { objectTiles } from "./tiles";

const section = homeSectionStyles();
const styles = objectsBentoStyles();

export function ObjectsBento() {
  return (
    <section className={section.root()} id="objects">
      <SectionHeading
        eyebrow="What makes it different"
        lead="Most kits give you rectangles. CuteUI also gives you things people already know how to use: folders that open, cards that fan out, notes you want to peel off."
        title="Objects, not boxes."
      />
      <div className={styles.grid()}>
        {objectTiles.map((tile) => (
          <ObjectTile hint={tile.hint} key={tile.id} line={tile.line} name={tile.name} span={tile.span}>
            {tile.demo}
          </ObjectTile>
        ))}
      </div>
      <div className={styles.also()}>
        <p className={styles.alsoText()}>
          <strong className={styles.alsoStrong()}>Plus every standard part.</strong> Buttons, menus, dialogs, sheets,
          forms, tabs and toasts, all on Base UI.
        </p>
        <ArrowLink href={siteLinks.components}>See all components</ArrowLink>
      </div>
    </section>
  );
}
