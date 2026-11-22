import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { Button } from "@cutecode/ui/components/button";
import { paginationStyles } from "./style";

const styles = paginationStyles();

export function BrowsePagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const hasSinglePage = totalPages <= 1;
  if (hasSinglePage) return null;

  return (
    <div className={styles.root()}>
      <Button variant="outline" className={styles.button()} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <AltArrowLeftIcon className={styles.icon()} aria-hidden="true" />
        Previous
      </Button>
      <span className={styles.count()}>
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        className={styles.button()}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <AltArrowRightIcon className={styles.icon()} aria-hidden="true" />
      </Button>
    </div>
  );
}
