import { Button } from "@cutecode/ui/components/button";
import { Chip } from "@cutecode/ui/tactile/chip";
import { CodeBlock } from "@cutecode/ui/tactile/code-block";
import { Tone } from "@cutecode/ui/tactile/tone";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { MagicWandIcon } from "@solar-icons/react/linear/magic-wand";

import { siteLinks } from "@/components/site-header/constants";

import { codeLines } from "./constants";
import { studioTeaserStyles } from "./style";

const styles = studioTeaserStyles();

export function StudioTeaser() {
  return (
    <section className={styles.root()}>
      <div className={styles.copy()}>
        <Chip icon={MagicWandIcon} tone={Tone.Purple}>
          Tools
        </Chip>
        <h2 className={styles.title()}>CuteCode Studio</h2>
        <p className={styles.description()}>Turn code into images and reels for your posts.</p>
        <Button render={<a href={siteLinks.studio} />} variant="gray">
          Open Studio
          <AltArrowRightIcon aria-hidden="true" />
        </Button>
      </div>
      <div className={styles.preview()}>
        <CodeBlock highlightedLine={5} lines={codeLines} />
      </div>
    </section>
  );
}
