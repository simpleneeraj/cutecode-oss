"use client";

import { WidgetExample } from "../shared/example";
import { MediumWidget } from "./index";

function MediumWidgetExample() {
  return <WidgetExample>{(props) => <MediumWidget {...props} />}</WidgetExample>;
}

export { MediumWidgetExample };
