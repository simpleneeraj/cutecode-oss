import type { GridColumn } from "@cutecode/calendar/parts/time-grid/columns";

import { detailOf, headerLabel } from "./face";
import { ResourceGlyph } from "./glyph";
import { resourceHeaderStyles } from "./style";

type ResourceHeaderProps = {
  column: GridColumn;
};

const styles = resourceHeaderStyles();

function ResourceHeader({ column }: ResourceHeaderProps) {
  const { resource } = column;
  if (resource === null) {
    return <div className={styles.root()} data-slot="resource-header" role="columnheader" />;
  }
  const detail = detailOf(resource);

  return (
    <div aria-label={headerLabel(resource)} className={styles.root()} data-slot="resource-header" role="columnheader">
      <span className={styles.glyph()}>
        <ResourceGlyph isRound={false} resource={resource} />
      </span>
      <span aria-hidden="true" className={styles.text()}>
        <span className={styles.name()}>{resource.name}</span>
        {detail !== null && <span className={styles.detail()}>{detail}</span>}
      </span>
    </div>
  );
}

export { ResourceHeader };
