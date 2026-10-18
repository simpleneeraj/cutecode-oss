import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import TriggerScene from "./trigger-scene";
import LiveEdge from "./live-edge";
import styles from "./triggerdev.module.css";

const background = <TriggerScene />;
const accent = <LiveEdge />;

export default function TriggerdevFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
