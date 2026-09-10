import { WindowControls } from "@/components/ui";

import styles from "./DayDetails.module.css";

interface DayDetailsProps {
  date: Date;
  onClose: () => void;
}

function DayDetails({ date, onClose }: DayDetailsProps) {
  return (
    <div
      className={styles.details}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${date.toDateString()}`}
    >
      <WindowControls
        variant="close"
        aria-label="Close day details"
        onClick={onClose}
      />
      <span>{`daily details ${date.toDateString()}`}</span>
    </div>
  );
}

export { DayDetails };
export type { DayDetailsProps };
