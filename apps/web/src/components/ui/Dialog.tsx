import { useEffect, useId, useRef } from "react";
import styles from "./Dialog.module.css";

import { Button } from "./Button";

export interface DialogProps {
  title: string;
  text: string;
  action1Text: string;
  onAction1: () => void;
  action2Text: string;
  onAction2: () => void;
}

function Dialog({
  title,
  text,
  action1Text,
  onAction1,
  action2Text,
  onAction2,
}: DialogProps) {
  const titleId = useId();
  const textId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const focusableElements = wrapper.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstFocusableElement = focusableElements[0];

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    } else {
      wrapper.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onAction2();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const focusableElements = Array.from(
      wrapper.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      event.preventDefault();
      wrapper.focus();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (!event.shiftKey && document.activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }

    if (event.shiftKey && document.activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
    }
  };

  return (
    <div
      className={styles.wrapper}
      role="presentation"
      onKeyDown={handleKeyDown}
      ref={wrapperRef}
      tabIndex={-1}
    >
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
    </div>
  );
}

export { Dialog };
