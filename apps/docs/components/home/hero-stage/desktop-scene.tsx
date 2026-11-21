import { AppIcon } from "@cutecode/ui/tactile/app-icon";
import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";
import { StickyNote } from "@cutecode/ui/tactile/sticky-note";

import { TicketFace } from "@/components/home/demo-objects/ticket-face";
import { NotificationDeck } from "@/components/home/notification-deck";

import { dockApps, heroTicket, ScenePlace } from "./constants";
import { ProjectsWindow } from "./projects-window";
import { SceneLayer, type SceneTilt } from "./scene-layer";
import { heroStageStyles } from "./style";

type DesktopSceneProps = {
  tilt: SceneTilt;
};

const styles = heroStageStyles();

export function DesktopScene({ tilt }: DesktopSceneProps) {
  return (
    <div className={styles.desktop()}>
      <SceneLayer place={ScenePlace.Window} tilt={tilt}>
        <ProjectsWindow />
      </SceneLayer>
      <SceneLayer place={ScenePlace.Notifications} tilt={tilt}>
        <NotificationDeck />
      </SceneLayer>
      <SceneLayer place={ScenePlace.Ticket} tilt={tilt}>
        <div className={styles.ticket()}>
          <TicketFace {...heroTicket} />
        </div>
      </SceneLayer>
      <SceneLayer place={ScenePlace.Sticky} tilt={tilt}>
        <div className={styles.sticky()}>
          <StickyNote>Base UI inside, Solar icons on top. Follows Apple&apos;s guidelines.</StickyNote>
        </div>
      </SceneLayer>
      <SceneLayer place={ScenePlace.Dock} tilt={tilt}>
        <div aria-hidden="true" className={styles.dock()}>
          {dockApps.map((app) => (
            <AppIcon icon={app.icon} key={app.id} size={AppIconSize.Small} />
          ))}
        </div>
      </SceneLayer>
    </div>
  );
}
