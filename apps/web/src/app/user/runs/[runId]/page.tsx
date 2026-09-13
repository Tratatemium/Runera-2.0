import type { Run } from "@runera/shared";

import { Panel } from "@/components/ui";

import styles from "./page.module.css";

interface RunPageProps {
  run: Run;
}

export default function RunPage({ run }: RunPageProps) {
  return (
    <main>
      <Panel variant="gradientAccent"></Panel>
    </main>
  );
}
