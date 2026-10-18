import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import SupabaseScene from "./supabase-scene";
import EdgeSweep from "./edge-sweep";
import styles from "./supabase.module.css";

const background = <SupabaseScene />;
const accent = <EdgeSweep />;

export default function SupabaseFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
