"use client";

import Frame from "@/components/editor/Frame";
import Controls from "@/components/editor/controls";
import SponsorsStrip from "@/components/sponsors/sponsors-strip";

export default function PageClient() {
  return (
    <div className="layout-fill">
      <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <Frame />
        <SponsorsStrip className="justify-center px-4 pb-4" />
      </div>
      <Controls />
    </div>
  );
}
