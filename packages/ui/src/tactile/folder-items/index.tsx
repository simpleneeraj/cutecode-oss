import { type FolderItem, folderItemPositions, folderItemsStyles, paperLineIds } from "./style";

type FolderItemsProps = {
  items: FolderItem[];
};

function FolderItems({ items }: FolderItemsProps) {
  const placedItems = folderItemPositions
    .slice(0, items.length)
    .map((position, index) => ({ position, item: items[index] }));

  return (
    <div aria-hidden="true" className={folderItemsStyles().root()} data-slot="folder-items">
      {placedItems.map(({ position, item }) => {
        const styles = folderItemsStyles({ item, position });
        return (
          <span className={styles.item()} key={position}>
            <span className={styles.photo()}>
              <span className={styles.firstBlob()} />
              <span className={styles.secondBlob()} />
            </span>
            <span className={styles.lines()}>
              {paperLineIds.map((lineId) => (
                <span className={styles.line()} key={lineId} />
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export { FolderItems };
