import { Chip } from "../chip";
import { Tone } from "../tone";
import { toneTint } from "../tone/style";
import { pocketCardStyles } from "./style";

type PocketCardProps = {
  title: string;
  meta: string;
  caption: string;
  tone?: Tone;
  chips?: string[];
};

function PocketCard({ title, meta, caption, tone = Tone.Gray, chips = [] }: PocketCardProps) {
  const styles = pocketCardStyles();

  return (
    <article className={styles.root({ class: toneTint[tone] })} data-slot="pocket-card">
      <div className={styles.face()}>
        <p className={styles.title()}>{title}</p>
        <p className={styles.meta()}>{meta}</p>
        <div className={styles.chips()}>
          {chips.map((chip) => (
            <Chip key={chip} tone={tone}>
              {chip}
            </Chip>
          ))}
        </div>
      </div>
      <span className={styles.caption()}>{caption}</span>
    </article>
  );
}

export { PocketCard, type PocketCardProps };
