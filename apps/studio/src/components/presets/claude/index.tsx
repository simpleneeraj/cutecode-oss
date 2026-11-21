import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import ClaudeScene from "./claude-scene";
import InkEdge from "./ink-edge";
import styles from "./claude.module.css";

const background = <ClaudeScene />;
const accent = <InkEdge />;

export default function ClaudeFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
