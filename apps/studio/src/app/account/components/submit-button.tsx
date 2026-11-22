import type { ReactNode } from "react";
import { Button } from "@cutecode/ui/components/button";
import { Spinner } from "@cutecode/ui/components/spinner";
import { authCardStyles } from "./style";

type SubmitButtonProps = {
  isLoading: boolean;
  loadingLabel: string;
  children: ReactNode;
};

const styles = authCardStyles();

export function SubmitButton({ isLoading, loadingLabel, children }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isLoading} className={styles.submit()}>
      {isLoading && <Spinner />}
      {isLoading ? loadingLabel : children}
    </Button>
  );
}
