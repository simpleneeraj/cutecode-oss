"use client";

import { WidgetExample } from "../shared/example";
import { SmallWidget } from "./index";

function SmallWidgetExample() {
  return <WidgetExample>{(props) => <SmallWidget {...props} />}</WidgetExample>;
}

export { SmallWidgetExample };
