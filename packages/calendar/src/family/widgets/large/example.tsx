"use client";

import { WidgetExample } from "../shared/example";
import { LargeWidget } from "./index";

function LargeWidgetExample() {
  return <WidgetExample>{(props) => <LargeWidget {...props} />}</WidgetExample>;
}

export { LargeWidgetExample };
