import { homeSectionStyles } from "@/components/home/section/style";
import { SectionHeading } from "@/components/home/section-heading";
import { ThemeDemo } from "@/components/home/theme-demo";

const section = homeSectionStyles();

export function ThemeSection() {
  return (
    <section className={section.root()} id="themes">
      <SectionHeading
        eyebrow="Themes"
        lead="Pick a style and every part follows: corners, depth, glass and type. Your brand color goes on top. Light and dark come with it."
        title="Six looks. One set of tokens."
      />
      <ThemeDemo />
    </section>
  );
}
