import { PartTile } from "@/components/home/part-tile";
import { SectionHeading } from "@/components/home/section-heading";

import { parts } from "./constants";
import { partsGridStyles } from "./style";

const styles = partsGridStyles();

export function PartsGrid() {
  return (
    <section className={styles.root()}>
      <SectionHeading
        accent="real"
        description="Each tile below is a working component. Tap the switches, pick a segment, open the menu."
        title="Every part is"
      />
      <div className={styles.grid()}>
        {parts.map((part) => (
          <PartTile description={part.description} key={part.id} title={part.title}>
            {part.demo}
          </PartTile>
        ))}
      </div>
    </section>
  );
}
