import { sectionHeadingStyles } from "./style";

type SectionHeadingProps = {
  title: string;
  accent?: string;
  description?: string;
  isCentered?: boolean;
};

export function SectionHeading({ title, accent, description, isCentered }: SectionHeadingProps) {
  const styles = sectionHeadingStyles({ isCentered });

  return (
    <div className={styles.root()}>
      <h2 className={styles.title()}>
        {title} {accent ? <em className={styles.accent()}>{accent}</em> : null}
      </h2>
      {description ? <p className={styles.description()}>{description}</p> : null}
    </div>
  );
}
