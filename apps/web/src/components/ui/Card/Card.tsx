import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./Card.module.css";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  cardLabel?: string;
  cardValue?: string;
  cardUnit?: string;
  variant?: "light" | "frosted" | "frostedWarm";
  type?: "duration";
}

function Card({
  children,
  variant = "light",
  type,
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
      {cardValue &&
        (type === "duration" ? (
          <span className={styles.value}>
            {cardValue.split(/(\s?[hms]\b)/).map((part, index) =>
              /[hms]\b/.test(part) ? (
                <span className={styles.durationUnit} key={index}>
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </span>
        ) : (
          <span className={styles.value}>{cardValue}</span>
        ))}
      {cardUnit && <span className={styles.unit}>{cardUnit}</span>}
    </div>
  );
}

export { Card };
