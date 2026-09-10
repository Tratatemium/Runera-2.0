"use client";

import type { DialogProps } from "@/components/ui";
import type { ConfirmDialogProps } from "@/components/ui";
import type { DayDetailsProps } from "@/components/user";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { AppError } from "@/errors/errors";
import { Dialog } from "@/components/ui";

interface DialogContextValue {
  closeDialog: () => void;
  openConfirmDialog: (options: ConfirmDialogProps) => void;
  openDayDetailsDialog: (options: Omit<DayDetailsProps, "onClose">) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogProps | null>(null);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const openConfirmDialog = useCallback(
    (options: ConfirmDialogProps) => {
      setDialog({
        isOpen: true,
        variant: "confirmDialog",
        ...options,
        onAction1: () => {
          options.onAction1();
          closeDialog();
        },
        onAction2: () => {
          options.onAction2();
          closeDialog();
        },
      });
    },
    [closeDialog],
  );

  const openDayDetailsDialog = useCallback(
    (options: Omit<DayDetailsProps, "onClose">) => {
      setDialog({
        isOpen: true,
        variant: "dayDetails",
        ...options,
        onClose: () => closeDialog(),
      });
    },
    [closeDialog],
  );

  const value = { closeDialog, openConfirmDialog, openDayDetailsDialog };

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog && <Dialog {...dialog} />}
    </DialogContext.Provider>
  );
}

function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new AppError("useDialogContext must be used inside DialogProvider");
  }

  return context;
}

export { DialogProvider, useDialogContext };
