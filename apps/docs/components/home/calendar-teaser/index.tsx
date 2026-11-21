import { Chip } from "@cutecode/ui/tactile/chip";
import { Tone } from "@cutecode/ui/tactile/tone";

import { ArrowLink } from "@/components/home/arrow-link";
import { FeatureList } from "@/components/home/feature-list";
import { homeSectionStyles } from "@/components/home/section/style";
import { SectionHeading } from "@/components/home/section-heading";
import { siteLinks } from "@/components/site-header/constants";

import { CalendarMock } from "./calendar-mock";
import { calendarPoints } from "./constants";

const section = homeSectionStyles();

export function CalendarTeaser() {
  return (
    <section className={section.root()} id="calendar">
      <div className={section.feature()}>
        <SectionHeading
          eyebrow={<Chip tone={Tone.Gray}>Coming soon</Chip>}
          lead="Most kits stop at picking a date. We are building a full scheduler you can drop into your app."
          title="A real calendar, not a date picker."
        >
          <FeatureList points={calendarPoints} />
          <ArrowLink href={siteLinks.github}>Follow along on GitHub</ArrowLink>
        </SectionHeading>
        <CalendarMock />
      </div>
    </section>
  );
}
