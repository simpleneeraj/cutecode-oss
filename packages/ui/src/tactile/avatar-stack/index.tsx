import { Avatar, AvatarFallback } from "../../components/avatar";
import type { Tone } from "../tone";
import { avatarStackFallbackStyles, avatarStackStyles } from "./style";

type Person = {
  id: string;
  initials: string;
  tone?: Tone;
};

type AvatarStackProps = {
  people: Person[];
};

const styles = avatarStackStyles();

function AvatarStack({ people }: AvatarStackProps) {
  const noun = people.length === 1 ? "person" : "people";

  return (
    <span aria-label={`${people.length} ${noun}`} className={styles.root()} data-slot="avatar-stack" role="img">
      {people.map((person) => (
        <Avatar aria-hidden="true" className={styles.avatar()} key={person.id}>
          <AvatarFallback className={avatarStackFallbackStyles({ tone: person.tone })}>
            {person.initials}
          </AvatarFallback>
        </Avatar>
      ))}
    </span>
  );
}

export { AvatarStack };
