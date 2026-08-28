import styles from "./Footer.module.css";

import { Link } from "react-router-dom";
import { Logo } from "../ui/";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link to="/" className={styles.brandLink} aria-label="Runera home">
            <Logo variant="primary" />
          </Link>
          <p className={styles.tagline}>
            Built for steady progress, one run at a time.
          </p>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/signup" className={styles.navLink}>
            Sign Up
          </Link>
          <Link to="/login" className={styles.navLink}>
            Log In
          </Link>
          <Link to="/user/dashboard" className={styles.navLink}>
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
