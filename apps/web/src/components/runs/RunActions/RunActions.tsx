"use client";

import type { Run } from "@runera/shared";

import Link from "next/link";
import { useRef, useEffect } from "react";

import { icons } from "@/components/icons/icons";
import { useDialogContext } from "@/context/DialogContext";
import type { LoadingState } from "@/hooks";

import styles from "./RunActions.module.css";

const { delete: DeleteIcon, edit: EditIcon } = icons.general;
const SpinnerIcon = icons.spinners.spinner;

interface RunActionsProps {
  run: Run;
  layout: "vertical" | "horizontal";
  loading: LoadingState;
  loadingRunId: string | null;
  onDelete: (runId: string) => Promise<void>;
  isRemoving: boolean;
  setIsRemoving: (value: boolean) => void;
}

const EXIT_ANIMATION_MS = 360;

function RunActions({
  run,
  layout,
  onDelete,
  loading,
  loadingRunId,
  isRemoving,
  setIsRemoving,
}: RunActionsProps) {
  const { openConfirmDialog } = useDialogContext();
  const deleteTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (deleteTimeoutRef.current) {
        window.clearTimeout(deleteTimeoutRef.current);
      }
    },
    [],
  );

  function handleDelete() {
    if (isRemoving) {
      return;
    }

    openConfirmDialog({
      title: "Delete Run",
      text: "Are you sure you want to delete this run?",
      action1Text: "No",
      onAction1: () => {},
      action2Text: "Yes",
      onAction2: () => {
        setIsRemoving(true);
        deleteTimeoutRef.current = window.setTimeout(() => {
          void onDelete(run.runId);
        }, EXIT_ANIMATION_MS);
      },
    });
  }

  const isDeletingCurrentRun =
    loading === "deletingRun" && loadingRunId === run.runId;
  const disableActions = isRemoving || isDeletingCurrentRun;

  return (
    <div
      className={styles.runActions}
      aria-label="Run actions"
      style={{ flexDirection: layout === "vertical" ? "column" : "row" }}
    >
      <button
        className={styles.actionButton}
        type="button"
        onClick={handleDelete}
        disabled={disableActions}
        aria-label={`Delete ${run.distanceKm} kilometer run from ${run.date}`}
        title="Delete run"
      >
        {isDeletingCurrentRun ? (
          <SpinnerIcon aria-hidden="true" focusable="false" />
        ) : (
          <DeleteIcon aria-hidden="true" focusable="false" />
        )}
      </button>
      <Link
        href={`/user/runs/${run.runId}/edit`}
        className={styles.actionButton}
        aria-label={`Edit ${run.distanceKm} kilometer run from ${run.date}`}
        title="Edit run"
      >
        {loading === "updatingRun" && loadingRunId === run.runId ? (
          <SpinnerIcon aria-hidden="true" focusable="false" />
        ) : (
          <EditIcon aria-hidden="true" focusable="false" />
        )}
      </Link>
    </div>
  );
}

export { RunActions };
