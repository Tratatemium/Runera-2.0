"use client";

import type { Run, RunsState, RunsContextValue } from "@runera/shared";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AppError } from "../errors/errors";
import { useAuthContext } from "./AuthContext";

const RunsContext = createContext<RunsContextValue | undefined>(undefined);

type RunsProviderProps = {
  children: ReactNode;
};

function RunsProvider({ children }: RunsProviderProps) {
  const [runs, setRuns] = useState<RunsState | undefined>(undefined);
  const [isHydratingRuns, setIsHydratingRuns] = useState(false);

  const runExists = useCallback((prev: RunsState | undefined, id: string) => {
    if (!prev) return false;
    return Boolean(prev[id]);
  }, []);

  const hydrateRunsState = useCallback((runs: RunsState) => setRuns(runs), []);

  const clearRunsState = useCallback(() => setRuns(undefined), []);

  const postNewRunState = useCallback((newRun: Run) => {
    setRuns((prev) => ({
      ...prev,
      [newRun.runId]: newRun,
    }));
  }, []);

  const updateRunState = useCallback(
    (updatedRun: Run) => {
      setRuns((prev) => {
        if (!runExists(prev, updatedRun.runId)) return prev;
        return {
          ...prev,
          [updatedRun.runId]: updatedRun,
        };
      });
    },
    [runExists],
  );

  const deleteRunState = useCallback(
    (id: string) => {
      setRuns((prev) => {
        if (!prev) return prev;
        if (!runExists(prev, id)) return prev;

        const { [id]: _removed, ...rest } = prev;
        void _removed;
        return rest;
      });
    },
    [runExists],
  );

  const { user } = useAuthContext();

  const value = useMemo(
    () => ({
      runs: user ? runs : undefined,
      isHydratingRuns,
      setIsHydratingRuns,
      hydrateRunsState,
      clearRunsState,
      postNewRunState,
      updateRunState,
      deleteRunState,
    }),
    [
      user,
      runs,
      isHydratingRuns,
      setIsHydratingRuns,
      hydrateRunsState,
      clearRunsState,
      postNewRunState,
      updateRunState,
      deleteRunState,
    ],
  );
  return <RunsContext.Provider value={value}>{children}</RunsContext.Provider>;
}

function useRunsContext() {
  const context = useContext(RunsContext);

  if (!context) {
    throw new AppError("useRunsContext must be used inside RunsProvider");
  }

  return context;
}

export { RunsProvider, useRunsContext };
