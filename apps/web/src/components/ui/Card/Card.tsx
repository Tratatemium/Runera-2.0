import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { IconType } from "react-icons/lib";

import styles from "./Card.module.css";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  cardLabel?: string;
  cardDate?: string;
  cardValue?: string;
  cardUnit?: string;
  variant?: "light";
  decorVariant?: number;
  type?: "duration";
  icon?: IconType;
}

function Card({
  children,
  variant = "light",
  decorVariant = 1,
  type,
  icon: Icon,
  className,
  cardLabel,
  cardDate,
  cardValue,
  cardUnit,
  ...divProps
}: CardProps) {
  return (
    <div
      {...divProps}
      className={[
        styles.card,
        styles[`variant${(decorVariant % 8) + 1}`],
        styles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      <div className={styles.content}>
        {cardLabel && <span className={styles.label}>{cardLabel}</span>}
        {cardValue &&
          (type === "duration" ? (
            <span className={styles.value}>
              {cardValue.split(/(\s?[hms]\b)/).map((part, index) =>
                /[hms]\b/.test(part) ? (
                  <span className={styles.unit} key={index}>
                    {` ${part}`}
                  </span>
                ) : (
                  part
                ),
              )}
            </span>
          ) : (
            <span className={styles.value}>
              {cardValue}
              {cardUnit && (
                <span className={styles.unit}>{` ${cardUnit}`}</span>
              )}
            </span>
          ))}
        {cardDate && <span className={styles.date}>{cardDate}</span>}
      </div>
      {Icon && (
        <div className={styles.iconBG}>
          <Icon className={styles.icon} />
        </div>
      )}
    </div>
  );
}

export { Card };
