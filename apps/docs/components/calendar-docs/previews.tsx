"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { ExampleId } from "./example-id";
import { calendarDocsStyles } from "./style";

const styles = calendarDocsStyles();

function PreviewSkeleton() {
  return <div aria-busy="true" className={styles.skeleton()} />;
}

function loadExample(importer: () => Promise<ComponentType>) {
  return dynamic(importer, { ssr: false, loading: PreviewSkeleton });
}

export const examplePreviews: Record<ExampleId, ComponentType> = {
  [ExampleId.Week]: loadExample(() => import("@cutecode/calendar/week/example").then((m) => m.WeekExample)),
  [ExampleId.Day]: loadExample(() => import("@cutecode/calendar/day/example").then((m) => m.DayExample)),
  [ExampleId.Month]: loadExample(() => import("@cutecode/calendar/month/example").then((m) => m.MonthExample)),
  [ExampleId.Agenda]: loadExample(() => import("@cutecode/calendar/agenda/example").then((m) => m.AgendaExample)),
  [ExampleId.Sidebar]: loadExample(() => import("@cutecode/calendar/sidebar/example").then((m) => m.SidebarExample)),
  [ExampleId.Phone]: loadExample(() => import("@cutecode/calendar/phone/example").then((m) => m.PhoneExample)),
  [ExampleId.Tablet]: loadExample(() => import("@cutecode/calendar/tablet/example").then((m) => m.TabletExample)),
  [ExampleId.QuickEvent]: loadExample(() => import("@cutecode/calendar/quick-event/example").then((m) => m.QuickEventExample)),
  [ExampleId.States]: loadExample(() => import("@cutecode/calendar/parts/state/example").then((m) => m.CalendarStatesExample)),
  [ExampleId.CompactMonth]: loadExample(() => import("@cutecode/calendar/compact-month/example").then((m) => m.CompactMonthExample)),
  [ExampleId.WeekStrip]: loadExample(() => import("@cutecode/calendar/week-strip/example").then((m) => m.WeekStripExample)),
  [ExampleId.DatePicker]: loadExample(() => import("@cutecode/calendar/date-picker/example").then((m) => m.DatePickerExample)),
  [ExampleId.RangePicker]: loadExample(() => import("@cutecode/calendar/range-picker/example").then((m) => m.RangePickerExample)),
  [ExampleId.Desk]: loadExample(() => import("@cutecode/calendar/desk/example").then((m) => m.DeskCalendarExample)),
  [ExampleId.WidgetSmall]: loadExample(() => import("@cutecode/calendar/widgets/small/example").then((m) => m.SmallWidgetExample)),
  [ExampleId.WidgetMedium]: loadExample(() => import("@cutecode/calendar/widgets/medium/example").then((m) => m.MediumWidgetExample)),
  [ExampleId.WidgetMediumNotch]: loadExample(() => import("@cutecode/calendar/widgets/medium-notch/example").then((m) => m.MediumNotchWidgetExample)),
  [ExampleId.WidgetLarge]: loadExample(() => import("@cutecode/calendar/widgets/large/example").then((m) => m.LargeWidgetExample)),
  [ExampleId.TaskAgenda]: loadExample(() => import("@cutecode/calendar/task-agenda/example").then((m) => m.TaskAgendaExample)),
  [ExampleId.Money]: loadExample(() => import("@cutecode/calendar/money/example").then((m) => m.MoneyCalendarExample)),
  [ExampleId.ResourcesDay]: loadExample(() => import("@cutecode/calendar-pro/resources-day/example").then((m) => m.ResourcesDayExample)),
  [ExampleId.Year]: loadExample(() => import("@cutecode/calendar-pro/year/example").then((m) => m.YearExample)),
  [ExampleId.HeatMonth]: loadExample(() => import("@cutecode/calendar-pro/heat-month/example").then((m) => m.HeatMonthExample)),
  [ExampleId.QuickAdd]: loadExample(() => import("@cutecode/calendar-pro/quick-add-field/example").then((m) => m.QuickAddExample)),
  [ExampleId.ZoneColumn]: loadExample(() => import("@cutecode/calendar-pro/zone-column/example").then((m) => m.ZoneColumnExample)),
  [ExampleId.ZoneBanner]: loadExample(() => import("@cutecode/calendar-pro/zone-banner/example").then((m) => m.ZoneBannerExample)),
  [ExampleId.Recurring]: loadExample(() => import("@cutecode/calendar-pro/recurring/example").then((m) => m.RecurringExample)),
};
