import { Chip } from "@cutecode/ui/tactile/chip";
import { Folder } from "@cutecode/ui/tactile/folder";
import { FolderItems } from "@cutecode/ui/tactile/folder-items";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";

import { SectionHeading } from "@/components/home/section-heading";

import { layers } from "./constants";
import { layerLadderStyles } from "./style";

const styles = layerLadderStyles();

export function LayerLadder() {
  return (
    <section className={styles.root()}>
      <SectionHeading
        description="Each layer is built from the one before it, so everything looks and behaves the same."
        isCentered
        title="Components. Then blocks. Then templates."
      />
      <ol className={styles.steps()}>
        {layers.map((layer) => (
          <li className={styles.step()} key={layer.id}>
            <span aria-hidden="true" className={styles.arrow()}>
              <AltArrowRightIcon className={styles.arrowIcon()} />
            </span>
            <div className={styles.body()}>
              <Folder
                count={layer.count}
                front={<Chip tone={layer.badgeTone}>{layer.badge}</Chip>}
                title={layer.title}
                tone={layer.tone}
              >
                <FolderItems items={layer.items} />
              </Folder>
              <p className={styles.description()}>{layer.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
