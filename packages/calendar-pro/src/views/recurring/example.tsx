"use client";

import { ExampleFrame } from "./example-frame";
import { exampleDate, exampleOptions } from "./example-data";
import { useExampleCalendar } from "./use-example-calendar";

function RecurringExample() {
  const example = useExampleCalendar(exampleDate, exampleOptions);

  return <ExampleFrame example={example} />;
}

export { RecurringExample };
