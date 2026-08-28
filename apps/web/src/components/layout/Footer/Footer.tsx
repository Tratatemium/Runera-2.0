import Link from "next/link";

import { Logo } from "@/components/ui";

import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link href="/" className={styles.brandLink} aria-label="Runera home">
            <Logo variant="primary" />
          </Link>
          <p className={styles.tagline}>
            Built for steady progress, one run at a time.
          </p>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/signup" className={styles.navLink}>
            Sign Up
          </Link>
          <Link href="/login" className={styles.navLink}>
            Log In
          </Link>
          <Link href="/user/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
        </nav>

        <div className={styles.meta}>
          <p className={styles.copy}>© {currentYear} Runera</p>
          <p className={styles.metaText}>Keep moving. Keep improving.</p>
        </div>
      </div>
    </footer>
  );
}
export { Footer };
