import { HeatLook, showsBadge, tileLevel, type HeatTile } from "./model";
import { heatMonthStyles, heatTileStyles } from "./style";

export type TileFocusProps = {
  tabIndex: number;
  "data-focus-key": string;
  onFocus: () => void;
};

type HeatTileButtonProps = {
  tile: HeatTile;
  look: HeatLook;
  focusProps: TileFocusProps;
  onSelect: (date: string) => void;
};

const monthStyles = heatMonthStyles();

function HeatTileButton({ tile, look, focusProps, onSelect }: HeatTileButtonProps) {
  if (!tile.inMonth) {
    return (
      <span aria-disabled="true" className={monthStyles.outside()} role="gridcell">
        {tile.number}
      </span>
    );
  }
  const styles = heatTileStyles({ level: tileLevel(tile, look), today: tile.today, selected: tile.selected });

  return (
    <button
      {...focusProps}
      aria-current={tile.today ? "date" : undefined}
      aria-label={tile.label}
      aria-selected={tile.selected}
      className={styles.root()}
      data-slot="heat-tile"
      onClick={() => onSelect(tile.date)}
      role="gridcell"
      type="button"
    >
      {showsBadge(tile, look) && (
        <span aria-hidden="true" className={styles.badge()}>
          {tile.count}
        </span>
      )}
      <span aria-hidden="true" className={styles.number()}>
        {tile.number}
      </span>
    </button>
  );
}

export { HeatTileButton };
