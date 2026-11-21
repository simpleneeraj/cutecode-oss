import type { ReactNode } from "react";

import { customizerStyles } from "./style";

type PickerSectionProps = {
  title: string;
  children: ReactNode;
};

const styles = customizerStyles();

export function PickerSection({ title, children }: PickerSectionProps) {
  return (
    <section className={styles.section()}>
      <h3 className={styles.sectionTitle()}>{title}</h3>
      {children}
    </section>
  );
}
