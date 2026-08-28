import type { DialogProps } from "../components/ui/Dialog";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { AppError } from "../errors/errors";
import { Dialog } from "../components/ui/Dialog";

interface DialogContextValue {
  openDialog: (options: DialogProps) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogProps | null>(null);

  const openDialog = useCallback((options: DialogProps) => {
    setDialog(options);
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const value = { openDialog, closeDialog };

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog && (
        <Dialog
          {...dialog}
          onAction1={() => {
            dialog.onAction1();
            closeDialog();
          }}
          onAction2={() => {
            dialog.onAction2();
            closeDialog();
          }}
        />
      )}
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
