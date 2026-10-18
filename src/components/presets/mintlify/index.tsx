import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import MintlifyScene from "./mintlify-scene";
import MintEdge from "./mint-edge";
import styles from "./mintlify.module.css";

const background = <MintlifyScene />;
const accent = <MintEdge />;

export default function MintlifyFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
