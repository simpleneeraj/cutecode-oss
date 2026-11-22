"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "../lib/cn";

function Card({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "squircle relative flex flex-col rounded-density-surface edge bg-card text-card-foreground shadow-rest",
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
      "squircle relative flex flex-col gap-1.5 rounded-density-overlay edge bg-muted p-1.5 text-card-foreground shadow-rest *:data-[slot=card]:shadow-none",
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
      "relative grid auto-rows-min items-start gap-x-4 px-4.5 py-2.5 has-data-[slot=card-frame-action]:grid-cols-fill-auto",
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
    className: cn("self-center font-semibold text-density-subheadline", className),
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
    className: cn("self-center text-density-subheadline text-muted-foreground", className),
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
    className: cn("col-start-2 nth-3:row-span-2 nth-3:row-start-1 inline-flex self-center justify-self-end", className),
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
    className: cn("px-4.5 py-2.5", className),
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
      "grid auto-rows-min items-start gap-1.5 p-6 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pb-4 has-data-[slot=card-action]:grid-cols-fill-auto",
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
    className: cn("font-heading font-semibold text-lg leading-none", className),
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
    className: cn("text-density-subheadline text-muted-foreground", className),
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
    className: cn("col-start-2 row-span-2 row-start-1 inline-flex self-start justify-self-end", className),
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
      "flex-1 p-6 in-[[data-slot=card]:has(>[data-slot=card-header]:not(.border-b))]:pt-0 in-[[data-slot=card]:has(>[data-slot=card-footer]:not(.border-t))]:pb-0",
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
    className: cn("flex items-center p-6 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-4", className),
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
