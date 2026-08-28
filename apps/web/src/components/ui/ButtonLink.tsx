import { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.css";
import { Link, useNavigate } from "react-router-dom";

interface ButtonLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, "to" | "children"> {
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
  const navigate = useNavigate();

  return (
    <Link
      to={goBack ? "." : linkDirection}
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }

        if (goBack) {
          e.preventDefault();
          navigate(-1);
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
