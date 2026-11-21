import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import DodoScene from "./dodo-scene";
import EdgeSweep from "./edge-sweep";
import styles from "./dodo-payments.module.css";

const background = <DodoScene />;
const accent = <EdgeSweep />;

export default function DodoPaymentsFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
