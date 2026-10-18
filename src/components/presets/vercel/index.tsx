import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import VercelScene from "./vercel-scene";
import EdgeSweep from "./edge-sweep";
import styles from "./vercel.module.css";

const background = <VercelScene />;
const accent = <EdgeSweep />;

export default function VercelFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
