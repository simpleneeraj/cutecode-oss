import { Fragment } from "react";

import { agentTeaserStyles } from "./style";

const styles = agentTeaserStyles();

export const agentPoints = [
  "MCP server to search, read and install parts",
  "llms.txt with every docs page as plain text",
  "Works in any editor that speaks MCP",
];

export const agentCode = (
  <Fragment>
    <span className={styles.keyword()}>import</span> {"{ "}
    <span className={styles.type()}>Folder</span>
    {" } "}
    <span className={styles.keyword()}>from</span>{" "}
    <span className={styles.string()}>&quot;@/components/ui/folder&quot;</span>
    {"\n\n"}
    <span className={styles.keyword()}>export function</span> <span className={styles.type()}>Recent</span>
    {"() {\n  "}
    <span className={styles.keyword()}>return</span> {"<"}
    <span className={styles.type()}>Folder</span> title=<span className={styles.string()}>&quot;Recent&quot;</span>{" "}
    count=
    <span className={styles.string()}>&quot;3 photos&quot;</span>
    {" />\n}"}
  </Fragment>
);

export const llmsText = (
  <Fragment>
    <span className={styles.comment()}># CuteUI</span>
    {"\n> React parts that feel like real objects.\n\n"}
    <span className={styles.comment()}>## Tactile</span>
    {
      "\n- Folder: opens on hover or tap\n- Notification stack: glass cards that fan out\n- Card stack: pocket cards that spread"
    }
  </Fragment>
);
