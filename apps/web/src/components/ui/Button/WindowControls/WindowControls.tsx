import { MdClose, MdMinimize } from "react-icons/md";

import styles from "./WindowControls.module.css";

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
      {variant === "close" && <MdClose className={styles.icon} />}
      {variant === "minimize" && <MdMinimize className={styles.icon} />}
    </button>
  );
}

export { WindowControls };
