"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "../lib/cn";

function Card({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "relative flex flex-col rounded-surface bg-card text-card-foreground shadow-rest",
      className,
    ),
    "data-slot": "card",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFrame({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "relative flex flex-col gap-1.5 rounded-overlay bg-muted p-1.5 text-card-foreground shadow-rest *:data-[slot=card]:shadow-none",
      className,
    ),
    "data-slot": "card-frame",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFrameHeader({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "relative grid auto-rows-min items-start gap-x-4 px-4.5 py-3 has-data-[slot=card-frame-action]:grid-cols-fill-auto",
      className,
    ),
    "data-slot": "card-frame-header",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFrameTitle({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("font-semibold text-subheadline", className),
    "data-slot": "card-frame-title",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFrameDescription({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("text-muted-foreground text-subheadline", className),
    "data-slot": "card-frame-description",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFrameAction({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("col-start-2 row-span-2 row-start-1 self-center justify-self-end inline-flex", className),
    "data-slot": "card-frame-action",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFrameFooter({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("px-4.5 py-3", className),
    "data-slot": "card-frame-footer",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardHeader({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "grid auto-rows-min items-start gap-1 p-5 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pb-3 has-data-[slot=card-action]:grid-cols-fill-auto",
      className,
    ),
    "data-slot": "card-header",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardTitle({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("font-semibold text-body", className),
    "data-slot": "card-title",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardDescription({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("text-muted-foreground text-subheadline", className),
    "data-slot": "card-description",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardAction({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end inline-flex", className),
    "data-slot": "card-action",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardPanel({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "flex-1 p-5 in-[[data-slot=card]:has(>[data-slot=card-header]:not(.border-b))]:pt-0 in-[[data-slot=card]:has(>[data-slot=card-footer]:not(.border-t))]:pb-0",
      className,
    ),
    "data-slot": "card-panel",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFooter({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("flex items-center p-5 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-3", className),
    "data-slot": "card-footer",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export {
  Card,
  CardFrame,
  CardFrameHeader,
  CardFrameTitle,
  CardFrameDescription,
  CardFrameAction,
  CardFrameFooter,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardPanel as CardContent,
  CardTitle,
};
