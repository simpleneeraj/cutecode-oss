import { liveRegionStyles } from "./style";
import type { LiveMessage } from "./use-announcer";

type LiveRegionProps = {
  message: LiveMessage;
};

function LiveRegion({ message }: LiveRegionProps) {
  return (
    <div aria-atomic="true" aria-live="polite" className={liveRegionStyles()} data-slot="live-region" role="status">
      <span key={message.sequence}>{message.text}</span>
    </div>
  );
}

export { LiveRegion };
