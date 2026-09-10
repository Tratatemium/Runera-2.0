"use client";

import { useId } from "react";

import { Button } from "@/components/ui";

import styles from "./ConfirmDialog.module.css";

export interface ConfirmDialogProps {
  title: string;
  text: string;
  action1Text: string;
  onAction1: () => void;
  action2Text: string;
  onAction2: () => void;
}

function ConfirmDialog({
  title,
  text,
  action1Text,
  onAction1,
  action2Text,
  onAction2,
}: ConfirmDialogProps) {
  const titleId = useId();
  const textId = useId();
  return (
    <div
      className={styles.card}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={textId}
    >
      <h3 className={styles.title} id={titleId}>
        {title}
      </h3>
      <p className={styles.text} id={textId}>
        {text}
      </p>
      <div className={styles.actionsWrapper}>
        <Button
          buttonText={action1Text}
          type="button"
          variant="primary"
          onClick={onAction1}
        />
        <Button
          buttonText={action2Text}
          type="button"
          variant="secondary"
          onClick={onAction2}
        />
      </div>
    </div>
  );
}

export { ConfirmDialog };
