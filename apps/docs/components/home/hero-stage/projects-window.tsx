import { Window } from "@cutecode/ui/tactile/window";

import { DesignsFolder } from "@/components/home/demo-objects/designs-folder";
import { LaunchFolder } from "@/components/home/demo-objects/launch-folder";
import { PhotosFolder } from "@/components/home/demo-objects/photos-folder";

import { sidebarPlaces, sidebarTags } from "./constants";
import { heroStageStyles } from "./style";

const styles = heroStageStyles();

function ProjectsSidebar() {
  return (
    <div aria-hidden="true" className={styles.sidebar()}>
      <span className={styles.sidebarLabel()}>Favorites</span>
      {sidebarPlaces.map((place) => (
        <span className={styles.sidebarRow({ isCurrent: place.isCurrent })} key={place.id}>
          <place.icon className={styles.sidebarIcon()} />
          {place.label}
        </span>
      ))}
      <span className={styles.sidebarLabel()}>Tags</span>
      {sidebarTags.map((tag) => (
        <span className={styles.sidebarRow()} key={tag.id}>
          <span className={styles.tagDot({ isAccent: tag.isAccent })} />
          {tag.label}
        </span>
      ))}
    </div>
  );
}

export function ProjectsWindow() {
  return (
    <Window title="Projects">
      <div className={styles.windowBody()}>
        <ProjectsSidebar />
        <div className={styles.windowMain()}>
          <div className={styles.windowGrid()}>
            <DesignsFolder />
            <PhotosFolder />
            <LaunchFolder />
          </div>
          <p className={styles.windowStatus()}>3 folders</p>
        </div>
      </div>
    </Window>
  );
}
