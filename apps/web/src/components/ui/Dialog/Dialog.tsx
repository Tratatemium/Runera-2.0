"use client";

import type { ConfirmDialogProps } from "@/components/ui/";
import type { DayDetailsProps } from "@/components/user";

import { useEffect, useRef } from "react";

import { ConfirmDialog } from "./ConfirmDialog/ConfirmDialog";

import styles from "./Dialog.module.css";
import { DayDetails } from "@/components/user/Calendar/DayDetails/DayDetails";

type DialogProps =
  | ({
      variant: "confirmDialog";
    } & ConfirmDialogProps)
  | ({
      variant: "dayDetalis";
    } & DayDetailsProps);

function Dialog(props: DialogProps) {
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
      if (props.variant === "confirmDialog") props.onAction2();
      if (props.variant === "dayDetalis") props.onClose();
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
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

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
      {props.variant === "confirmDialog" && <ConfirmDialog {...props} />}
      {props.variant === "dayDetalis" && <DayDetails {...props} />}
    </div>
  );
}

export { Dialog };
export type { DialogProps };
