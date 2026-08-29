"use client";

import { AuthProvider } from "@/context/AuthContext";
import { RunsProvider } from "@/context/RunsContext";
import { DialogProvider } from "@/context/DialogContext";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RunsProvider>
        <DialogProvider>{children}</DialogProvider>
      </RunsProvider>
    </AuthProvider>
  );
}

export { Providers };
