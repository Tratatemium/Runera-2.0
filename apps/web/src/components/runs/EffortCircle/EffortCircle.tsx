import styles from "./EffortCircle.module.css";

import { CircleProgress } from "@/components/ui";

function EffortCircle({ perceivedEffort }: { perceivedEffort?: number }) {
  return (
    <div className={styles.effortWrapper}>
      {perceivedEffort ? (
        <CircleProgress
          className={styles.effortCircle}
          radius={25}
          percentage={perceivedEffort * 10}
          showNumber={"decimal"}
        />
      ) : (
        <span className={styles.effortPlaceholder}>-</span>
      )}
      <span>Effort</span>
    </div>
  );
}

export { EffortCircle };
