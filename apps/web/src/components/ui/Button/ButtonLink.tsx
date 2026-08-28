import type { ComponentPropsWithoutRef } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./Button.module.css";

interface ButtonLinkProps extends Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "to" | "href" | "children"
> {
  children?: React.ReactNode;
  linkDirection: string;
  linkText: string;
  variant: "primary" | "secondary" | "transparent" | "transparentAccent";
  size?: "small";
  disabled?: boolean;
  active?: boolean;
  goBack?: boolean;
}

function ButtonLink({
  children,
  linkDirection,
  linkText,
  variant,
  size,
  disabled,
  active,
  goBack = false,
  className,
  onClick,
  ...linkProps
}: ButtonLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={goBack ? "#" : linkDirection}
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }

        if (goBack) {
          e.preventDefault();
          router.back();
        }

        onClick?.(e);
      }}
      className={[
        styles.button,
        styles[variant],
        size ? styles[size] : undefined,
        disabled ? styles.disabled : undefined,
        active ? styles.active : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...linkProps}
    >
      {children && <span className={styles.icon}>{children}</span>}
      <span>{linkText}</span>
    </Link>
  );
}

export { ButtonLink };
