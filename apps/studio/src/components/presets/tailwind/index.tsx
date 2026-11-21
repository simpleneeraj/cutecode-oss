import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import TailwindScene from "./tailwind-scene";
import BeamEdge from "./beam-edge";
import styles from "./tailwind.module.css";

const background = <TailwindScene />;
const accent = <BeamEdge />;

export default function TailwindFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
