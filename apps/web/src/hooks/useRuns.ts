import type { RunData } from "../types/runs.types";

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRunsContext } from "../context/RunsContext";

import {
  apiGetMyRuns,
  apiPostNewRun,
  apiUpdateRun,
  apiDeleteRun,
} from "../api/runs.api";
import { normalizeRunData, normalizeMyRuns } from "../utils/runs.utils";

interface UseRunsReturn {
  loading: LoadingState;
  loadingRunId: string | null;
  formError: string | undefined;
  getMyRuns: () => Promise<void>;
  postNewRun: (payload: RunData) => Promise<void>;
  updateRun: (runId: string, payload: RunData) => Promise<void>;
  deleteRun: (runId: string) => Promise<void>;
}

export type LoadingState =
  | "idle"
  | "fetchingRuns"
  | "creatingRun"
  | "updatingRun"
  | "deletingRun";

function useRuns(): UseRunsReturn {
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [loadingRunId, setLoadingRunId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const {
    setIsHydratingRuns,
    hydrateRunsState,
    postNewRunState,
    updateRunState,
    deleteRunState,
  } = useRunsContext();
  const navigate = useNavigate();

  const getMyRuns = useCallback(async () => {
    setLoading("fetchingRuns");
    setIsHydratingRuns(true);
    try {
      const response = await apiGetMyRuns();
      hydrateRunsState(normalizeMyRuns(response));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading("idle");
      setIsHydratingRuns(false);
    }
  }, [hydrateRunsState, setIsHydratingRuns]);

  const postNewRun = useCallback(
    async (payload: RunData) => {
      setLoading("creatingRun");
      setFormError(undefined);
      try {
        const response = await apiPostNewRun(payload);
        postNewRunState(normalizeRunData(response));
        navigate("/user/runs");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading("idle");
      }
    },
    [postNewRunState, navigate],
  );

  const updateRun = useCallback(
    async (runId: string, payload: RunData) => {
      setLoading("updatingRun");
      setLoadingRunId(runId);
      setFormError(undefined);
      try {
        const response = await apiUpdateRun(runId, payload);
        updateRunState(normalizeRunData(response));
        navigate("/user/runs");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading("idle");
        setLoadingRunId(null);
      }
    },
    [updateRunState, navigate],
  );

  const deleteRun = useCallback(
    async (runId: string) => {
      setLoading("deletingRun");
      setLoadingRunId(runId);
      setFormError(undefined);
      try {
        await apiDeleteRun(runId);
        deleteRunState(runId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading("idle");
        setLoadingRunId(null);
      }
    },
    [deleteRunState],
  );

  return {
    loading,
    loadingRunId,
    formError,
    getMyRuns,
    postNewRun,
    updateRun,
    deleteRun,
  };
}

export { useRuns };
