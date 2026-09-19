import { icons } from "@/components/icons/icons";
import styles from "./WindowControls.module.css";

const { close: CloseIcon, minimize: MinimizeIcon } = icons.general;

interface WindowControlsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "close" | "minimize";
}

function WindowControls({
  variant,
  type = "button",
  ...props
}: WindowControlsProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type={type}
      {...props}
    >
      {variant === "close" && <CloseIcon className={styles.icon} />}
      {variant === "minimize" && <MinimizeIcon className={styles.icon} />}
    </button>
  );
}

export { WindowControls };
