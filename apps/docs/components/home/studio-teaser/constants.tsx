import { studioTeaserStyles } from "./style";

const styles = studioTeaserStyles();

export const codeLines = [
  <span key="import">
    <span className={styles.keyword()}>import</span> {"{ "}
    <span className={styles.type()}>Folder</span>
    {" } "}
    <span className={styles.keyword()}>from</span>{" "}
    <span className={styles.string()}>&quot;@/components/ui/folder&quot;</span>
  </span>,
  "",
  <span key="function">
    <span className={styles.keyword()}>export function</span> <span className={styles.type()}>Projects</span>
    {"() {"}
  </span>,
  <span key="return">
    {"  "}
    <span className={styles.keyword()}>return</span> (
  </span>,
  <span key="folder">
    {"    <"}
    <span className={styles.type()}>Folder</span> title=<span className={styles.string()}>&quot;Designs&quot;</span>{" "}
    count=<span className={styles.string()}>&quot;32 items&quot;</span>
    {" />"}
  </span>,
  "  )",
  "}",
];
