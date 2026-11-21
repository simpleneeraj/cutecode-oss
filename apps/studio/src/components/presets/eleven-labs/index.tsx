import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import WaveformScene from "./waveform-scene";
import ProgressEdge from "./progress-edge";
import styles from "./eleven-labs.module.css";

const background = <WaveformScene />;
const accent = <ProgressEdge />;

export default function ElevenLabsFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
