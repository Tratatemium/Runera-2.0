"use client";

import { FaRegCalendar, FaPlus } from "react-icons/fa";
import { useAuthContext } from "@/context/AuthContext";
import { ButtonLink, Panel } from "@/components/ui";
import { StatsPanel } from "@/components/user";

import styles from "./page.module.css";

export default function Dashboard() {
  const { user } = useAuthContext();
  if (!user) return null;

  return (
    <main className={styles.main}>
      <Panel variant="opaqueAccent" className={styles.panel}>
        <div className={styles.greeting}>
          <h1>Welcome back, {user.account.username}!</h1>
          <p>Here&apos;s a snapshot of your running journey.</p>
        </div>

        <Panel variant="frostedAccent" className={styles.ctaPanel}>
          <h2>Ready to run?</h2>
          <div className={styles.ctaButtons}>
            <ButtonLink
              linkDirection="/user/runs/new"
              linkText="Log a Run"
              variant="primary"
            >
              <FaPlus />
            </ButtonLink>
            <ButtonLink
              linkDirection="/user/runs/new"
              linkText="Plan Training"
              variant="tertiary"
            >
              <FaRegCalendar />
            </ButtonLink>
          </div>
        </Panel>

        <StatsPanel type="stats"></StatsPanel>
        <StatsPanel type="records"></StatsPanel>
      </Panel>
    </main>
  );
}
