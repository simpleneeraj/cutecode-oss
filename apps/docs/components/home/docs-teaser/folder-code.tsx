import { docsTeaserStyles } from "./style";

const styles = docsTeaserStyles();

export function FolderCode() {
  return (
    <pre className={styles.code()}>
      <span className={styles.keyword()}>import</span> {"{ "}
      <span className={styles.type()}>Folder</span>
      {" } "}
      <span className={styles.keyword()}>from</span>{" "}
      <span className={styles.string()}>&quot;@/components/ui/folder&quot;</span>
      {"\n\n"}
      {"<"}
      <span className={styles.type()}>Folder</span> title=<span className={styles.string()}>&quot;Designs&quot;</span>{" "}
      count=<span className={styles.string()}>&quot;32 items&quot;</span>
      {" />"}
    </pre>
  );
}
