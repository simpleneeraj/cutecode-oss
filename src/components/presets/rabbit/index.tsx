import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import RabbitScene from "./rabbit-scene";
import EdgeSweep from "./edge-sweep";
import styles from "./rabbit.module.css";

const background = <RabbitScene />;
const accent = <EdgeSweep />;

export default function RabbitFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
