import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import ResendScene from "./resend-scene";
import LineGlow from "./line-glow";
import styles from "./resend.module.css";

const background = <ResendScene />;
const accent = <LineGlow />;

export default function ResendFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
