import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { AltArrowUpIcon } from "@solar-icons/react/linear/alt-arrow-up";

import { FoldEdge, type FoldPill as FoldPillModel } from "./fold";
import { foldPillStyles } from "./style";

type FoldPillProps = {
  pill: FoldPillModel;
  columnCount: number;
  onToggle: (edge: FoldEdge) => void;
};

const styles = foldPillStyles();

function FoldPill({ pill, columnCount, onToggle }: FoldPillProps) {
  const pointsUp = (pill.edge === FoldEdge.Earlier) !== pill.isOpen;
  const ArrowIcon = pointsUp ? AltArrowUpIcon : AltArrowDownIcon;

  return (
    <div className={styles.row()} data-slot="fold-pill" role="row">
      <div aria-colspan={columnCount} className={styles.cell()} role="gridcell">
        <button
          aria-expanded={pill.isOpen}
          className={styles.pill()}
          onClick={() => onToggle(pill.edge)}
          tabIndex={-1}
          type="button"
        >
          <ArrowIcon aria-hidden="true" className={styles.icon()} />
          {pill.label}
        </button>
      </div>
    </div>
  );
}

export { FoldPill };
