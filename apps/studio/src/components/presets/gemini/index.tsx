import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import GeminiScene from "./gemini-scene";
import PrismEdge from "./prism-edge";
import styles from "./gemini.module.css";

const background = <GeminiScene />;
const accent = <PrismEdge />;

export default function GeminiFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
