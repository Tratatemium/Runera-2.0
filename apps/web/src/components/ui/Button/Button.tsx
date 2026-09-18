import styles from "./Button.module.css";
import { icons } from "@/components/icons/icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  buttonText: string;
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "transparent"
    | "transparentAccent"
    | "toggle";
  isSubmitting?: boolean;
  active?: boolean;
  size?: "small";
}

function Button({
  children,
  buttonText,
  type = "button",
  variant,
  isSubmitting = false,
  active = false,
  size,
  className,
  ...props
}: ButtonProps) {
  const SpinnerIcon = icons.spinners.spinner;
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        size ? styles[size] : undefined,
        active ? styles.active : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={isSubmitting}
      type={type}
      disabled={isSubmitting}
      {...props}
    >
      {children && <span className={styles.icon}>{children}</span>}
      <span>{isSubmitting ? <SpinnerIcon /> : buttonText}</span>
    </button>
  );
}

export { Button };
