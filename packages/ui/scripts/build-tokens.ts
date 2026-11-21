import { writeFileSync } from "node:fs";
import { renderTokensCss, tokensFile } from "../src/tokens/css";

writeFileSync(tokensFile, renderTokensCss());
