"use client";

import { FaRegCalendar, FaPlus } from "react-icons/fa";
import { useAuthContext } from "@/context/AuthContext";
import { ButtonLink, Panel, Card } from "@/components/ui";

import styles from "./page.module.css";

export default function Dashboard() {
  const { user } = useAuthContext();
  if (!user) return null;

  return (
    <main className={styles.main}>
      <Panel variant="light" className={styles.panel}>
        <div className={styles.greeting}>
          <h1>Welcome back, {user.account.username}!</h1>
          <p>Here&apos;s a snapshot of your running journey.</p>
        </div>

        <Panel variant="frosted" className={styles.ctaPanel}>
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

        <Panel variant="frosted" className={styles.statsPanel}>
          <div className={styles.statsPanelHeader}>
            <h3>Your stats</h3>
            <div>switch</div>
          </div>
          <div className={styles.cardsWrapper}>
            <Card
              cardLabel="Total runs"
              cardValue="—"
              cardUnit="runs logged"
            ></Card>
            <Card cardLabel="Total distance" cardValue="—" cardUnit="km"></Card>
            <Card cardLabel="Total time" cardValue="—" cardUnit=" "></Card>
            <Card
              cardLabel="Average pace"
              cardValue="—"
              cardUnit="min/km"
            ></Card>
          </div>
        </Panel>
      </Panel>
    </main>
  );
}
