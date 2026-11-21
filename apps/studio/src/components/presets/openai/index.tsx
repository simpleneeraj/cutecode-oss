import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import OpenAIScene from "./openai-scene";
import styles from "./openai.module.css";

const background = <OpenAIScene />;

export default function OpenAIFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} />;
}
