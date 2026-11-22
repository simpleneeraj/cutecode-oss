import { readFile } from "node:fs/promises";
import path from "node:path";

import { highlight } from "fumadocs-core/highlight";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { createCssVariablesTheme } from "shiki";

import { DocsCodeBlock } from "@/components/docs-mdx/code-block";

import { ExampleId, FrameSize } from "./example-id";
import { PreviewFrame } from "./preview-frame";
import { calendarDocsStyles } from "./style";

type CalendarDemoProps = {
  id: ExampleId;
  size?: FrameSize;
  canNarrow?: boolean;
  startNarrow?: boolean;
};

type ExampleSource = {
  file: string;
  title: string;
};

const exampleSources: Record<ExampleId, ExampleSource[]> = {
  [ExampleId.Week]: [
    { file: "calendar/src/views/week/example.tsx", title: "@cutecode/calendar/week/example" },
    { file: "calendar/src/parts/time-grid/example.tsx", title: "demo helper: parts/time-grid/example.tsx" },
  ],
  [ExampleId.Day]: [
    { file: "calendar/src/views/day/example.tsx", title: "@cutecode/calendar/day/example" },
    { file: "calendar/src/parts/time-grid/example.tsx", title: "demo helper: parts/time-grid/example.tsx" },
  ],
  [ExampleId.Month]: [
    { file: "calendar/src/views/month/example.tsx", title: "@cutecode/calendar/month/example" },
  ],
  [ExampleId.Agenda]: [
    { file: "calendar/src/views/agenda/example.tsx", title: "@cutecode/calendar/agenda/example" },
  ],
  [ExampleId.Sidebar]: [
    { file: "calendar/src/views/sidebar/example.tsx", title: "@cutecode/calendar/sidebar/example" },
  ],
  [ExampleId.Phone]: [
    { file: "calendar/src/views/phone/example.tsx", title: "@cutecode/calendar/phone/example" },
  ],
  [ExampleId.Tablet]: [
    { file: "calendar/src/views/tablet/example.tsx", title: "@cutecode/calendar/tablet/example" },
  ],
  [ExampleId.QuickEvent]: [
    { file: "calendar/src/parts/quick-event/example.tsx", title: "@cutecode/calendar/quick-event/example" },
  ],
  [ExampleId.States]: [
    { file: "calendar/src/parts/state/example.tsx", title: "@cutecode/calendar/parts/state/example" },
  ],
  [ExampleId.CompactMonth]: [
    { file: "calendar/src/family/compact-month/example.tsx", title: "@cutecode/calendar/compact-month/example" },
  ],
  [ExampleId.WeekStrip]: [
    { file: "calendar/src/family/week-strip/example.tsx", title: "@cutecode/calendar/week-strip/example" },
  ],
  [ExampleId.DatePicker]: [
    { file: "calendar/src/family/date-picker/example.tsx", title: "@cutecode/calendar/date-picker/example" },
  ],
  [ExampleId.RangePicker]: [
    { file: "calendar/src/family/range-picker/example.tsx", title: "@cutecode/calendar/range-picker/example" },
  ],
  [ExampleId.Desk]: [
    { file: "calendar/src/family/desk/example.tsx", title: "@cutecode/calendar/desk/example" },
  ],
  [ExampleId.WidgetSmall]: [
    { file: "calendar/src/family/widgets/small/example.tsx", title: "@cutecode/calendar/widgets/small/example" },
    { file: "calendar/src/family/widgets/shared/example.tsx", title: "demo helper: family/widgets/shared/example.tsx" },
  ],
  [ExampleId.WidgetMedium]: [
    { file: "calendar/src/family/widgets/medium/example.tsx", title: "@cutecode/calendar/widgets/medium/example" },
    { file: "calendar/src/family/widgets/shared/example.tsx", title: "demo helper: family/widgets/shared/example.tsx" },
  ],
  [ExampleId.WidgetMediumNotch]: [
    { file: "calendar/src/family/widgets/medium-notch/example.tsx", title: "@cutecode/calendar/widgets/medium-notch/example" },
    { file: "calendar/src/family/widgets/shared/example.tsx", title: "demo helper: family/widgets/shared/example.tsx" },
  ],
  [ExampleId.WidgetLarge]: [
    { file: "calendar/src/family/widgets/large/example.tsx", title: "@cutecode/calendar/widgets/large/example" },
    { file: "calendar/src/family/widgets/shared/example.tsx", title: "demo helper: family/widgets/shared/example.tsx" },
  ],
  [ExampleId.TaskAgenda]: [
    { file: "calendar/src/family/task-agenda/example.tsx", title: "@cutecode/calendar/task-agenda/example" },
  ],
  [ExampleId.Money]: [
    { file: "calendar/src/family/money/example.tsx", title: "@cutecode/calendar/money/example" },
  ],
  [ExampleId.ResourcesDay]: [
    { file: "calendar-pro/src/views/resources-day/example.tsx", title: "@cutecode/calendar-pro/resources-day/example" },
  ],
  [ExampleId.Year]: [
    { file: "calendar-pro/src/views/year/example.tsx", title: "@cutecode/calendar-pro/year/example" },
  ],
  [ExampleId.HeatMonth]: [
    { file: "calendar-pro/src/views/heat-month/example.tsx", title: "@cutecode/calendar-pro/heat-month/example" },
  ],
  [ExampleId.QuickAdd]: [
    { file: "calendar-pro/src/parts/quick-add-field/example.tsx", title: "@cutecode/calendar-pro/quick-add-field/example" },
  ],
  [ExampleId.ZoneColumn]: [
    { file: "calendar-pro/src/parts/zone-column/example.tsx", title: "@cutecode/calendar-pro/zone-column/example" },
  ],
  [ExampleId.ZoneBanner]: [
    { file: "calendar-pro/src/parts/zone-banner/example.tsx", title: "@cutecode/calendar-pro/zone-banner/example" },
  ],
  [ExampleId.Recurring]: [
    { file: "calendar-pro/src/views/recurring/example.tsx", title: "@cutecode/calendar-pro/recurring/example" },
  ],
};

const packagesRoot = path.join(process.cwd(), "../../packages");

const cssTheme = createCssVariablesTheme();

const tabLabels = ["Preview", "Code"];

const styles = calendarDocsStyles();

async function renderSource({ file, title }: ExampleSource) {
  const code = await readFile(path.join(packagesRoot, file), "utf8");
  return highlight(code.trimEnd(), {
    lang: "tsx",
    themes: { light: cssTheme },
    defaultColor: "light",
    meta: { title },
    components: { pre: DocsCodeBlock },
  });
}

export async function CalendarDemo({ id, size, canNarrow, startNarrow }: CalendarDemoProps) {
  const blocks = await Promise.all(exampleSources[id].map(renderSource));

  return (
    <Tabs items={tabLabels}>
      <Tab value="Preview">
        <PreviewFrame canNarrow={canNarrow} id={id} size={size} startNarrow={startNarrow} />
      </Tab>
      <Tab value="Code">
        <div className={styles.codeStack()}>{blocks}</div>
      </Tab>
    </Tabs>
  );
}
