"use client";

import { Tabs, TabsList, TabsPanel, TabsTab } from "@cutecode/ui/components/tabs";
import {
  renderThemeCss,
  serializeStyleSettings,
  type StyleSettings,
  styleSettingsCookie,
} from "@cutecode/ui/provider";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { useState } from "react";

import { CopyTextButton } from "@/components/customizer/copy-text-button";
import { PickerSection } from "@/components/customizer/picker-section";

import { CodeView } from "./code-view";
import { ExportFormat, exportFormats } from "./constants";
import { themeBuilderStyles } from "./style";

type ExportCodeProps = {
  settings: StyleSettings;
};

const styles = themeBuilderStyles();
const formatValues = Object.values(ExportFormat);

const exportReaders = {
  [ExportFormat.Css]: (settings: StyleSettings) => renderThemeCss(settings).trimEnd(),
  [ExportFormat.Html]: (settings: StyleSettings) =>
    `<html data-style="${settings.style}" data-palette="${settings.palette}" data-font="${settings.font}">`,
  [ExportFormat.Cookie]: (settings: StyleSettings) =>
    `${styleSettingsCookie.name}=${serializeStyleSettings(settings)}`,
} satisfies Record<ExportFormat, (settings: StyleSettings) => string>;

export function ExportCode({ settings }: ExportCodeProps) {
  const [format, setFormat] = useState(ExportFormat.Css);

  function selectFormat(value: unknown) {
    const selected = formatValues.find((option) => option === value);
    if (selected) {
      setFormat(selected);
    }
  }

  return (
    <PickerSection title="Export">
      <Tabs onValueChange={selectFormat} value={format}>
        <div className={styles.exportBar()}>
          <TabsList aria-label="Export format">
            {formatValues.map((option) => (
              <TabsTab key={option} value={option}>
                {exportFormats[option].label}
              </TabsTab>
            ))}
          </TabsList>
          <CopyTextButton
            copiedLabel="Copied"
            icon={CopyIcon}
            label="Copy"
            readText={() => exportReaders[format](settings)}
          />
        </div>
        {formatValues.map((option) => (
          <TabsPanel key={option} value={option}>
            <CodeView code={exportReaders[option](settings)} hint={exportFormats[option].hint} />
          </TabsPanel>
        ))}
      </Tabs>
    </PickerSection>
  );
}
