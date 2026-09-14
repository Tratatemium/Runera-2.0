import { RunItemFull } from "@/components/runs";

import styles from "./page.module.css";

interface RunPageProps {
  params: Promise<{
    runId: string;
  }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { runId } = await params;

  return (
    <main className={styles.main}>
      <RunItemFull runId={runId} />
    </main>
  );
}
