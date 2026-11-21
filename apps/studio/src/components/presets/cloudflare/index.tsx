import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import CloudflareScene from "./cloudflare-scene";
import EdgeSweep from "./edge-sweep";
import styles from "./cloudflare.module.css";

const background = <CloudflareScene />;
const accent = <EdgeSweep />;

export default function CloudflareFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
