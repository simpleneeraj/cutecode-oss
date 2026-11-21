"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "../lib/cn";

type TabsVariant = "default" | "underline";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2 data-[orientation=vertical]:flex-row", className)}
      data-slot="tabs"
      {...props}
    />
  );
}

function TabsList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        "relative z-0 flex w-fit items-center justify-center gap-0.5 text-foreground data-[orientation=vertical]:flex-col",
        variant === "default"
          ? "rounded-control bg-muted p-0.75 data-[orientation=vertical]:rounded-surface"
          : "data-[orientation=vertical]:px-1 data-[orientation=horizontal]:py-1 *:data-[slot=tabs-tab]:hover:bg-muted",
        className,
      )}
      data-slot="tabs-list"
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        className={cn(
          "-translate-y-(--active-tab-bottom) absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) transition-all duration-200 ease-out motion-reduce:transition-none",
          variant === "underline"
            ? "data-[orientation=vertical]:-translate-x-px z-10 rounded-control bg-brand data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=horizontal]:translate-y-px"
            : "-z-1 rounded-control bg-segment-thumb shadow-thumb",
        )}
        data-slot="tab-indicator"
      />
    </TabsPrimitive.List>
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "hit-area relative flex h-9.5 min-w-16 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-control px-4 font-medium text-subheadline text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:shadow-focus data-disabled:pointer-events-none data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-active:text-foreground data-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="tabs-tab"
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel className={cn("flex-1 outline-none", className)} data-slot="tabs-content" {...props} />;
}

export { Tabs, TabsList, TabsTab, TabsTab as TabsTrigger, TabsPanel, TabsPanel as TabsContent, TabsPrimitive };
