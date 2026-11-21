import { Ticket } from "@cutecode/ui/tactile/ticket";

import { ticketFaceStyles } from "./style";

type TicketSeat = {
  id: string;
  label: string;
  value: string;
};

type TicketFaceProps = {
  code: string;
  label: string;
  name: string;
  when: string;
  seats: TicketSeat[];
};

const styles = ticketFaceStyles();

export function TicketFace({ code, label, name, when, seats }: TicketFaceProps) {
  const stub = (
    <span className={styles.seats()}>
      {seats.map((seat) => (
        <span className={styles.seat()} key={seat.id}>
          <span className={styles.seatLabel()}>{seat.label}</span>
          <span className={styles.seatValue()}>{seat.value}</span>
        </span>
      ))}
    </span>
  );

  return (
    <Ticket code={code} stub={stub}>
      <span className={styles.label()}>{label}</span>
      <span className={styles.name()}>{name}</span>
      <span className={styles.when()}>{when}</span>
    </Ticket>
  );
}
