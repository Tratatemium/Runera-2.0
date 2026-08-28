import type { Run, RunsState, RunsContextValue } from "../types/runs.types";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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
  const [isHydaratingRuns, setIsHydratingRuns] = useState(false);

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

        const { [id]: _, ...rest } = prev;
        return rest;
      });
    },
    [runExists],
  );

  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) clearRunsState();
  }, [user, clearRunsState]);

  const value = useMemo(
    () => ({
      runs,
      isHydaratingRuns,
      setIsHydratingRuns,
      hydrateRunsState,
      clearRunsState,
      postNewRunState,
      updateRunState,
      deleteRunState,
    }),
    [
      runs,
      isHydaratingRuns,
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
