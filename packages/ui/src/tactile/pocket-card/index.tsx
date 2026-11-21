import { Chip } from "../chip";
import { Tone } from "../tone";
import { pocketCardStyles, pocketChipTones } from "./style";

type PocketCardProps = {
  title: string;
  meta: string;
  caption: string;
  tone?: Tone;
  chips?: string[];
};

function PocketCard({ title, meta, caption, tone = Tone.Neutral, chips = [] }: PocketCardProps) {
  const styles = pocketCardStyles({ look: tone });

  return (
    <article className={styles.root()} data-slot="pocket-card">
      <div className={styles.face()}>
        <p className={styles.title()}>{title}</p>
        <p className={styles.meta()}>{meta}</p>
        <div className={styles.chips()}>
          {chips.map((chip) => (
            <Chip key={chip} tone={pocketChipTones[tone]}>
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
