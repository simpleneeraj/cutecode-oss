"use client";

import { useEffect } from "react";
import { startRum } from "@/lib/analytics/rum";

export default function RumMonitor() {
  useEffect(() => {
    startRum().catch(() => undefined);
  }, []);
  return null;
}
