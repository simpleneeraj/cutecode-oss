import type { Resource } from "@cutecode/calendar/types";
import { MonitorIcon } from "@solar-icons/react/line-duotone/monitor";
import { UsersGroupRoundedIcon } from "@solar-icons/react/line-duotone/users-group-rounded";

import { faceOf, initialsOf, ResourceFace } from "./face";
import { resourceGlyphStyles } from "./style";

type ResourceGlyphProps = {
  resource: Resource;
  isRound: boolean;
};

function ResourceGlyph({ resource, isRound }: ResourceGlyphProps) {
  const face = faceOf(resource);
  const styles = resourceGlyphStyles({ isRound: isRound || face === ResourceFace.Initials });

  return (
    <span aria-hidden="true" className={styles.root()} data-slot="resource-glyph">
      {face === ResourceFace.Room && <UsersGroupRoundedIcon className={styles.icon()} />}
      {face === ResourceFace.Equipment && <MonitorIcon className={styles.icon()} />}
      {face === ResourceFace.Initials && <span className={styles.initials()}>{initialsOf(resource.name)}</span>}
    </span>
  );
}

export { ResourceGlyph };
