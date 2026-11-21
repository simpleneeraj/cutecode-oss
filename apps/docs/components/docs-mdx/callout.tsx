import { CloseCircleIcon } from "@solar-icons/react/linear/close-circle";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { DangerTriangleIcon } from "@solar-icons/react/linear/danger-triangle";
import { InfoCircleIcon } from "@solar-icons/react/linear/info-circle";
import { LightbulbIcon } from "@solar-icons/react/linear/lightbulb";
import { CalloutContainer, CalloutDescription, CalloutTitle } from "fumadocs-ui/components/callout";
import type { ComponentProps, ReactNode } from "react";

type CalloutType = NonNullable<ComponentProps<typeof CalloutContainer>["type"]>;

type CalloutProps = ComponentProps<typeof CalloutContainer> & { title?: ReactNode };

const iconClassName = "size-5 -me-0.5 text-(--callout-color)";

const icons: Record<CalloutType, ReactNode> = {
  info: <InfoCircleIcon aria-hidden="true" className={iconClassName} />,
  warning: <DangerTriangleIcon aria-hidden="true" className={iconClassName} />,
  warn: <DangerTriangleIcon aria-hidden="true" className={iconClassName} />,
  error: <CloseCircleIcon aria-hidden="true" className={iconClassName} />,
  success: <CheckCircleIcon aria-hidden="true" className={iconClassName} />,
  idea: <LightbulbIcon aria-hidden="true" className={iconClassName} />,
};

export function Callout({ children, title, type = "info", ...props }: CalloutProps) {
  return (
    <CalloutContainer icon={icons[type]} type={type} {...props}>
      {title ? <CalloutTitle>{title}</CalloutTitle> : null}
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}
