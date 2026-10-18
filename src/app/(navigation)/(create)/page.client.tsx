"use client";

import Frame from "@/components/editor/Frame";
import Controls from "@/components/editor/controls";
import SponsorsStrip from "@/components/sponsors/sponsors-strip";
import useUrlParams from "@/components/editor/use-url-params";

export default function PageClient() {
  const isReady = useUrlParams();
  return (
    <div className="layout-fill">
      <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <Frame isReady={isReady} />
        <SponsorsStrip className="justify-center px-4 pb-4" />
      </div>
      <Controls />
    </div>
  );
}
