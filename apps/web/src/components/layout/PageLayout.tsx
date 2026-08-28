import styles from "./PageLayout.module.css";

import { Outlet } from "react-router-dom";
import { Header, Footer } from "./";
import { ScrollToTop } from "./ScrollToTop";

function PageLayout() {
  return (
    <div className={styles.layout}>
      <ScrollToTop />
      <Header />
      <div className={styles.contentWrapper}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export { PageLayout };
