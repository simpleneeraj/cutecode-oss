"use client";

import { TimeGridExample } from "../../parts/time-grid/example";
import { ViewKind } from "../../types";

function WeekExample() {
  return <TimeGridExample initialView={ViewKind.Week} />;
}

export { WeekExample };
