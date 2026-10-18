import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import OpenAIScene from "./openai-scene";
import EdgeSweep from "./edge-sweep";
import styles from "./openai.module.css";

const background = <OpenAIScene />;
const accent = <EdgeSweep />;

export default function OpenAIFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
