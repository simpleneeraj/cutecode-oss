import { pageControlStyles } from "./style";

type PageControlProps = {
  count: number;
  current: number;
};

const styles = pageControlStyles();

function PageControl({ count, current }: PageControlProps) {
  const pages = Array.from({ length: count }, (_, index) => index);

  return (
    <div aria-label={`Page ${current + 1} of ${count}`} className={styles.root()} data-slot="page-control" role="img">
      {pages.map((page) => (
        <span className={styles.dot()} data-current={page === current ? "" : undefined} key={page} />
      ))}
    </div>
  );
}

export { PageControl };
