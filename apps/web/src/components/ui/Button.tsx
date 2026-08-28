import styles from "./Button.module.css";
import { icons } from "../icons/icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  buttonText: string;
  variant: "primary" | "secondary" | "transparent" | "transparentAccent";
  isSubmitting?: boolean;
  size?: "small";
}

function Button({
  children,
  buttonText,
  type = "button",
  variant,
  isSubmitting = false,
  size,
  ...props
}: ButtonProps) {
  const SpinnerIcon = icons.spinner;
  return (
    <button
      className={`${styles.button} ${styles[variant]}${size ? ` ${styles[size]}` : ""}`}
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
