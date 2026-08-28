import styles from "./Home.module.css";
import { icons } from "../components/icons/icons";
import runners1 from "../assets/runners-1.jpg";
import runners3 from "../assets/runners-3.jpg";

import { useAuthContext } from "../context/AuthContext";

import { Logo, ButtonLink } from "../components/ui/";

function Home() {
  const { user } = useAuthContext();
  const { graph: GraphIcon, chart: ChartIcon, medal: MedalIcon } = icons;

  return (
    <main>
      <section className={styles.hero}>
        <img src={runners1} alt="" className={styles.image} />
        <section className={styles.cta}>
          <Logo variant="primary" size="big"></Logo>
          <h1 className={styles.title}>Track Every Step</h1>
          <p className={styles.subtitle}>
            Log your runs, monitor progress, and achieve your goals with Runera.
          </p>

          <div className={styles.actions}>
            {user ? (
              <ButtonLink
                linkDirection="/user/runs"
                linkText="My runs"
                variant="primary"
              ></ButtonLink>
            ) : (
              <>
                <ButtonLink
                  linkDirection="/signup"
                  linkText="Sign Up"
                  variant="primary"
                ></ButtonLink>
                <ButtonLink
                  linkDirection="/login"
                  linkText="Log In"
                  variant="secondary"
                ></ButtonLink>
              </>
            )}
          </div>
        </section>
        <img src={runners3} alt="" className={styles.image} />
      </section>

      <section className={styles.highlights}>
        <h2>Everything You Need</h2>
        <div className={styles.featuresWrapper}>
          <div className={`${styles.feature} ${styles.graph}`}>
            <GraphIcon className={`${styles.icon} ${styles.graph}`} />
            <h3 className={styles.graph}>Track Runs</h3>
            <p>
              Quickly log your distance, time, and pace with our simple
              interface designed for speed.
            </p>
          </div>
          <div className={`${styles.feature} ${styles.chart}`}>
            <ChartIcon className={`${styles.icon} ${styles.chart}`} />
            <h3 className={styles.chart}>View Statistics</h3>
            <p>
              Get clear insights into your total distance, average pace, and
              weekly progress.
            </p>
          </div>
          <div className={`${styles.feature} ${styles.medal}`}>
            <MedalIcon className={`${styles.icon} ${styles.medal}`} />
            <h3 className={styles.medal}>Monitor Progress</h3>
            <p>
              Stay motivated with performance tracking and see how you improve
              over time.
            </p>
          </div>
        </div>
      </section>

      {!user && (
        <section className={styles.signupCta}>
          <h2>Ready to Start Running?</h2>
          <p>
            Join runners who are tracking their progress and achieving their
            goals.
          </p>
          <ButtonLink
            linkDirection="/signup"
            linkText="Create Free Account"
            variant="primary"
          ></ButtonLink>
        </section>
      )}
    </main>
  );
}

export { Home };
