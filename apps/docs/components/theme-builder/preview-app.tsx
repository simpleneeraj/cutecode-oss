import { Button } from "@cutecode/ui/components/button";
import type { StyleSettings } from "@cutecode/ui/provider";
import { NotificationStack } from "@cutecode/ui/tactile/notification-stack";
import { Toolbar, ToolbarActions, ToolbarBrand, ToolbarLink, ToolbarLinks } from "@cutecode/ui/tactile/toolbar";

import { previewLinks, previewNotifications, themeBuilder } from "./constants";
import { PreviewCode } from "./preview-code";
import { PreviewFolders } from "./preview-folders";
import { PreviewForm } from "./preview-form";
import { PreviewPlan } from "./preview-plan";
import { PreviewSettings } from "./preview-settings";
import { PreviewStats } from "./preview-stats";
import { themeBuilderStyles } from "./style";

type PreviewAppProps = {
  settings: StyleSettings;
};

const styles = themeBuilderStyles();
const previewHref = `#${themeBuilder.previewId}`;

export function PreviewApp({ settings }: PreviewAppProps) {
  return (
    <div
      aria-label="Theme preview"
      className={styles.preview()}
      data-font={settings.font}
      data-palette={settings.palette}
      data-style={settings.style}
      id={themeBuilder.previewId}
      role="region"
    >
      <Toolbar>
        <ToolbarBrand href={previewHref}>Acme</ToolbarBrand>
        <ToolbarLinks label="Preview">
          {previewLinks.map((link) => (
            <ToolbarLink href={previewHref} isCurrent={link.isCurrent} key={link.id}>
              {link.label}
            </ToolbarLink>
          ))}
        </ToolbarLinks>
        <ToolbarActions>
          <Button size="sm">New project</Button>
        </ToolbarActions>
      </Toolbar>
      <PreviewStats />
      <div className={styles.previewGrid()}>
        <div className={styles.column()}>
          <PreviewSettings />
          <PreviewForm />
          <PreviewFolders />
        </div>
        <div className={styles.column()}>
          <NotificationStack notifications={previewNotifications} />
          <PreviewPlan />
          <PreviewCode settings={settings} />
        </div>
      </div>
    </div>
  );
}
