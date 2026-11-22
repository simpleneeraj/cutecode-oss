"use client";

import { WidgetExample } from "../shared/example";
import { MediumNotchWidget } from "./index";

function MediumNotchWidgetExample() {
  return <WidgetExample>{(props) => <MediumNotchWidget {...props} />}</WidgetExample>;
}

export { MediumNotchWidgetExample };
