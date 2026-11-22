"use client";

import { Skeleton } from "@cutecode/ui/components/skeleton";

import { compactMonthCopy, type FilterChip } from "./model";
import { filterChipStyles } from "./style";

type FilterChipsProps = {
  chips: FilterChip[];
  value: string;
  isLoading: boolean;
  onValueChange: (calendarId: string) => void;
};

const styles = filterChipStyles();
const skeletonIds = ["first", "second", "third"];

function FilterChips({ chips, value, isLoading, onValueChange }: FilterChipsProps) {
  if (isLoading) {
    return (
      <div aria-hidden="true" className={styles.strip()}>
        {skeletonIds.map((id) => (
          <Skeleton key={id} className={styles.skeleton()} />
        ))}
      </div>
    );
  }

  return (
    <div aria-label={compactMonthCopy.filters} className={styles.strip()} role="group">
      {chips.map((chip) => {
        const isPressed = chip.id === value;
        const chipStyles = filterChipStyles({ isPressed });
        return (
          <button
            key={chip.id}
            aria-pressed={isPressed}
            className={chipStyles.chip()}
            onClick={() => onValueChange(chip.id)}
            type="button"
          >
            {chip.label}
            <small className={chipStyles.count()}>{chip.count}</small>
          </button>
        );
      })}
    </div>
  );
}

export { FilterChips };
