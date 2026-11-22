import { Button } from "@cutecode/ui/components/button";
import { tabBarStyles } from "@cutecode/ui/tactile/tab-bar/style";
import { HistoryIcon } from "@solar-icons/react/bold-duotone/history";
import { Home2Icon } from "@solar-icons/react/bold-duotone/home-2";
import { UsersGroupRoundedIcon } from "@solar-icons/react/bold-duotone/users-group-rounded";
import type { Icon } from "@solar-icons/react/lib/types";
import { AddIcon } from "@solar-icons/react/linear/add";

import { taskCopy } from "./copy";
import { AgendaTab, type AgendaNavigation } from "./props";
import { agendaBarStyles } from "./style";

type AgendaBarProps = {
  navigation: AgendaNavigation | undefined;
  onTaskAdd: () => void;
};

type AgendaTabsProps = {
  navigation: AgendaNavigation;
};

type TabOption = {
  tab: AgendaTab;
  label: string;
  icon: Icon;
};

const tabOptions: TabOption[] = [
  { tab: AgendaTab.Home, label: "Home", icon: Home2Icon },
  { tab: AgendaTab.Insights, label: "Insights", icon: HistoryIcon },
  { tab: AgendaTab.Profile, label: "Profile", icon: UsersGroupRoundedIcon },
];

const styles = agendaBarStyles();

const tabStyles = tabBarStyles();

function AgendaTabs({ navigation }: AgendaTabsProps) {
  return (
    <nav aria-label={taskCopy.app} className={tabStyles.root()}>
      {tabOptions.map((option) => {
        const isCurrent = option.tab === navigation.tab;
        const Glyph = option.icon;
        return (
          <button
            key={option.tab}
            aria-current={isCurrent ? "page" : undefined}
            className={tabStyles.tab()}
            data-current={isCurrent ? "" : undefined}
            onClick={() => navigation.onTabChange(option.tab)}
            type="button"
          >
            <Glyph aria-hidden="true" className={tabStyles.icon()} />
            <span className={tabStyles.label()}>{option.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function AgendaBar({ navigation, onTaskAdd }: AgendaBarProps) {
  return (
    <div className={styles.root()} data-slot="agenda-bar">
      {navigation && <AgendaTabs navigation={navigation} />}
      <Button aria-label={taskCopy.newTask} className={styles.add()} onClick={onTaskAdd} size="icon-xl">
        <AddIcon aria-hidden="true" className={styles.addIcon()} />
      </Button>
    </div>
  );
}

export { AgendaBar };
