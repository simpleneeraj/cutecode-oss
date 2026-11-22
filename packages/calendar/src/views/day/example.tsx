"use client";

import { TimeGridExample } from "../../parts/time-grid/example";
import { ViewKind } from "../../types";

function DayExample() {
  return <TimeGridExample initialView={ViewKind.Day} />;
}

export { DayExample };
