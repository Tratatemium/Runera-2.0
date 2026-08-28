import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Panel.module.css";

interface PanelProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant: "light" | "frosted" | "frostedWarm";
}

function Panel({ children, variant, className, ...divProps }: PanelProps) {
  return (
    <div
      {...divProps}
      className={[styles.panel, styles[variant], className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

export { Panel };
