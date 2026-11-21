import { InstallCommand } from "@cutecode/ui/tactile/install-command";

import { homeSectionStyles } from "@/components/home/section/style";
import { SectionHeading } from "@/components/home/section-heading";

import { installSteps } from "./constants";
import { installSectionStyles } from "./style";

const section = homeSectionStyles();
const styles = installSectionStyles();

export function InstallSection() {
  return (
    <section className={section.root()} id="install">
      <SectionHeading
        eyebrow="Install"
        isCentered
        lead="Parts install with the shadcn CLI. The source lands in your project, so you can change anything."
        title="One command. Then it is yours."
      />
      <div className={styles.command()}>
        <InstallCommand item="@cutecode/folder" />
        <p className={styles.note()}>
          Needs a <code className={styles.code()}>components.json</code>. Run{" "}
          <code className={styles.code()}>npx shadcn@latest init</code> if you have none.
        </p>
      </div>
      <ol className={styles.steps()}>
        {installSteps.map((step, index) => (
          <li className={styles.step()} key={step.id}>
            <span aria-hidden="true" className={styles.number()}>
              {index + 1}
            </span>
            <span className={styles.text()}>
              <span className={styles.title()}>{step.title}</span>
              <span className={styles.body()}>{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
