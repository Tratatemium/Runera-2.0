import styles from "./Logo.module.css";

interface LogoProps {
  showBrandName?: boolean;
  variant: "primary" | "secondary";
  size?: "small" | "big";
}

function Logo({ showBrandName = true, variant, size = "small" }: LogoProps) {
  return (
    <div className={`${styles.logoLockup} ${styles[variant]} ${styles[size]}`}>
      <div className={styles.logo}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
        </svg>
      </div>
      <p className={`${styles.brandName} ${showBrandName ? "" : "hide"}`}>
        Runera
      </p>
    </div>
  );
}

export { Logo };
