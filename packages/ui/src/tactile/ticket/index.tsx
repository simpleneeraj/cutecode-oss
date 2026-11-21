import type { ReactNode } from "react";

import type { Tone } from "../tone";
import { barWidths, ticketStyles } from "./style";

type TicketProps = {
  code: string;
  stub: ReactNode;
  tone?: Tone;
  children: ReactNode;
};

function barsFromCode(code: string) {
  return Array.from(code, (character, position) => ({
    position,
    width: barWidths[character.charCodeAt(0) % barWidths.length],
  }));
}

function Ticket({ code, stub, tone, children }: TicketProps) {
  const styles = ticketStyles({ look: tone });

  return (
    <div className={styles.root()} data-slot="ticket">
      <div className={styles.main()}>{children}</div>
      <div aria-hidden="true" className={styles.join()}>
        <span className={styles.perforation()} />
        <span className={styles.leftNotch()} />
        <span className={styles.rightNotch()} />
      </div>
      <div className={styles.stub()}>
        <div className={styles.stubContent()}>{stub}</div>
        <div className={styles.barcode()}>
          <span aria-hidden="true" className={styles.bars()}>
            {barsFromCode(code).map((bar) => (
              <span className={ticketStyles({ width: bar.width }).bar()} key={bar.position} />
            ))}
          </span>
          <span className={styles.code()}>{code}</span>
        </div>
      </div>
    </div>
  );
}

export { Ticket };
