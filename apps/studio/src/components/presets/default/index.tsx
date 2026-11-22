import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import { BlurBackdrop } from "../BlurBackdrop";
import styles from "./default.module.css";

type WindowHeaderProps = Pick<BaseFrameProps, "fileName" | "onFileNameChange">;

function WindowHeader({ fileName, onFileNameChange }: WindowHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.controls}>
        <div className={styles.control} />
        <div className={styles.control} />
        <div className={styles.control} />
      </div>
      <div className={styles.fileName}>
        <input
          type="text"
          value={fileName}
          onChange={(event) => onFileNameChange(event.target.value)}
          spellCheck={false}
          tabIndex={-1}
        />
        {fileName.length === 0 ? <span data-ignore-in-export>Untitled-1</span> : null}
      </div>
    </div>
  );
}

const DefaultFrame = ({
  padding,
  darkMode,
  transparent,
  fileName,
  themeBackground,
  backgroundImage,
  onFileNameChange,
  themeId,
  children,
}: BaseFrameProps) => {
  return (
    <div
      className={cn(
        styles.frame,
        styles[themeId || "default"],
        darkMode && styles.darkMode,
        !transparent && styles.withBackground,
      )}
      style={{
        padding,
        backgroundImage: !transparent ? `var(--frame-scene, ${themeBackground})` : "",
        backgroundSize: backgroundImage ? "cover" : undefined,
        backgroundPosition: backgroundImage ? "center" : undefined,
      }}
    >
      {transparent && <div data-ignore-in-export className={styles.transparentPattern}></div>}
      <div className={cn(styles.shell, !transparent && styles.withShadow)}>
        <div className={styles.rim}>
          <BlurBackdrop
            key={`${themeId}-${darkMode}-${transparent}`}
            blurAmount={30}
            tintColor="var(--frame-rim-tint)"
            tintBoxShadow="var(--frame-rim-edge)"
          />
        </div>
        <div className={styles.window}>
          <WindowHeader fileName={fileName} onFileNameChange={onFileNameChange} />
          <div className={styles.code}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DefaultFrame;
