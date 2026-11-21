import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame } from "../scene";
import StripeScene from "./stripe-scene";
import RibbonEdge from "./ribbon-edge";
import styles from "./stripe.module.css";

const background = <StripeScene />;
const accent = <RibbonEdge />;

export default function StripeFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
