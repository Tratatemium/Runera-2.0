import styles from "./DayDetails.module.css";

interface DayDetailsProps {
  date: Date;
  onClose: () => void;
}

function DayDetails({ date, onClose }: DayDetailsProps) {
  return (
    <div className={styles.details}>
      <span>{`daily details ${date.toDateString()}`}</span>
    </div>
  );
}

export { DayDetails };
export type { DayDetailsProps };
