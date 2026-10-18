import VoiceOrb from "./voice-orb";
import styles from "./openai.module.css";

export default function OpenAIScene() {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.dotGrid} />
      <VoiceOrb />
      <div className={styles.grain} />
    </div>
  );
}
