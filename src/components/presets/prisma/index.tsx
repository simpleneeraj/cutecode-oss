import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import PrismaScene from "./prisma-scene";
import SpectrumEdge from "./spectrum-edge";
import styles from "./prisma.module.css";

const background = <PrismaScene />;
const accent = <SpectrumEdge />;

export default function PrismaFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
