import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import ClerkScene from "./clerk-scene";
import VioletEdge from "./violet-edge";
import styles from "./clerk.module.css";

const background = <ClerkScene />;
const accent = <VioletEdge />;

export default function ClerkFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
