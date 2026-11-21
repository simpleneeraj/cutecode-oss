import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import NuxtScene from "./nuxt-scene";
import SummitEdge from "./summit-edge";
import styles from "./nuxt.module.css";

const background = <NuxtScene />;
const accent = <SummitEdge />;

export default function NuxtFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
