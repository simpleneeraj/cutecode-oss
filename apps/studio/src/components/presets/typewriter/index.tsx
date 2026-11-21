import { motion, easeInOut } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const SLUGS = [
  { id: "slug-a", glyph: "a", x: 6, y: 12, tilt: -12, ink: styles.black },
  { id: "slug-brace", glyph: "{", x: 16, y: 34, tilt: 8, ink: styles.red },
  { id: "slug-q", glyph: "Q", x: 4, y: 58, tilt: 14, ink: styles.black },
  { id: "slug-amp", glyph: "&", x: 14, y: 82, tilt: -6, ink: styles.red },
  { id: "slug-g", glyph: "g", x: 90, y: 10, tilt: 10, ink: styles.red },
  { id: "slug-semi", glyph: ";", x: 82, y: 30, tilt: -14, ink: styles.black },
  { id: "slug-r", glyph: "R", x: 93, y: 52, tilt: 6, ink: styles.black },
  { id: "slug-close", glyph: "}", x: 84, y: 74, tilt: -10, ink: styles.red },
  { id: "slug-e", glyph: "e", x: 46, y: 4, tilt: 4, ink: styles.black },
  { id: "slug-percent", glyph: "%", x: 58, y: 90, tilt: -8, ink: styles.black },
];

type Slug = (typeof SLUGS)[number];

type TypeSlugProps = {
  slug: Slug;
  index: number;
};

function TypeSlug({ slug, index }: TypeSlugProps) {
  const options = { phase: index / SLUGS.length, ease: easeInOut };
  const y = useLoop([0, -12, 0], options);
  const rotate = useLoop([slug.tilt, -slug.tilt / 2, slug.tilt], options);

  return (
    <motion.span className={cn(styles.slug, slug.ink)} style={{ left: `${slug.x}%`, top: `${slug.y}%`, y, rotate }}>
      {slug.glyph}
    </motion.span>
  );
}

function DraftLine() {
  const opacity = useLoop([1, 1, 0, 0, 1], { cycles: 6 });

  return (
    <span className={styles.draft}>
      draft no. 1
      <motion.span className={styles.caret} style={{ opacity }} />
    </span>
  );
}

function TypewriterScene() {
  const lampX = useLoop([0, 30, 0], { ease: easeInOut });
  const lampScale = useLoop([1, 1.06, 1], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.ruled} />
      <div className={styles.margin} />
      <motion.div className={styles.lamp} style={{ x: lampX, scale: lampScale }} />
      {SLUGS.map((slug, index) => (
        <TypeSlug key={slug.id} slug={slug} index={index} />
      ))}
      <DraftLine />
    </div>
  );
}

function InkRibbon() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <TypewriterScene />;
const accent = <InkRibbon />;

export default function TypewriterFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
