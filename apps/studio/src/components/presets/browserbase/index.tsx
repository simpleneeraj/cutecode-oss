import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import BrowserbaseScene from "./browserbase-scene";
import LoadingBar from "./loading-bar";
import styles from "./browserbase.module.css";

const background = <BrowserbaseScene />;
const accent = <LoadingBar />;

export default function BrowserbaseFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
