import { writeFileSync } from "node:fs";
import { renderTokensCss } from "../src/tokens/css";
import { tokensFile } from "../src/tokens/file";

writeFileSync(tokensFile, renderTokensCss());
