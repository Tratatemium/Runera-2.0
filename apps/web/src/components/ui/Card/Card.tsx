import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./Card.module.css";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  cardLabel?: string;
  cardValue?: string;
  cardUnit?: string;
  variant?: "light" | "frosted" | "frostedWarm";
}

function Card({
  children,
  variant = "light",
  className,
  cardLabel,
  cardValue,
  cardUnit,
  ...divProps
}: CardProps) {
  return (
    <div
      {...divProps}
      className={[styles.card, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {cardLabel && <span className={styles.label}>{cardLabel}</span>}
      {cardValue && <span className={styles.value}>{cardValue}</span>}
      {cardUnit && <span className={styles.unit}>{cardUnit}</span>}
    </div>
  );
}

export { Card };
