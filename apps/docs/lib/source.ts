import { BookMinimalisticIcon } from "@solar-icons/react/linear/book-minimalistic";
import { DownloadMinimalisticIcon } from "@solar-icons/react/linear/download-minimalistic";
import { Widget5Icon } from "@solar-icons/react/linear/widget-5";
import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { createElement } from "react";

const pageIcons = {
  BookMinimalistic: BookMinimalisticIcon,
  DownloadMinimalistic: DownloadMinimalisticIcon,
  Widget5: Widget5Icon,
};

function isPageIcon(name: string | undefined): name is keyof typeof pageIcons {
  return name !== undefined && Object.hasOwn(pageIcons, name);
}

function renderPageIcon(name: string | undefined) {
  if (!isPageIcon(name)) return undefined;
  return createElement(pageIcons[name], { "aria-hidden": "true" });
}

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon: renderPageIcon,
});
