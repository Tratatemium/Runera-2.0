import type { RunRequest } from "@runera/shared";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useRunsContext } from "@/context/RunsContext";
import {
  apiGetMyRuns,
  apiPostNewRun,
  apiUpdateRun,
  apiDeleteRun,
} from "@/api/runs.api";
import { useUser } from "@/hooks";
import { normalizeRunData, normalizeMyRuns } from "@/utils/runs.utils";
import { handleApiFormError } from "@/utils/api.utils";

interface UseRunsReturn {
  loading: LoadingState;
  loadingRunId: string | null;
  formError: string | undefined;
  getMyRuns: () => Promise<void>;
  postNewRun: (payload: RunRequest) => Promise<void>;
  updateRun: (runId: string, payload: RunRequest) => Promise<void>;
  deleteRun: (runId: string) => Promise<void>;
}

type LoadingState =
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
  const router = useRouter();
  const { updateStats } = useUser();

  const getMyRuns = useCallback(async () => {
    setLoading("fetchingRuns");
    setIsHydratingRuns(true);
    try {
      const response = await apiGetMyRuns();
      hydrateRunsState(normalizeMyRuns(response));
    } catch (err) {
      handleApiFormError(err, setFormError);
    } finally {
      setLoading("idle");
      setIsHydratingRuns(false);
    }
  }, [hydrateRunsState, setIsHydratingRuns]);

  const postNewRun = useCallback(
    async (payload: RunRequest) => {
      setLoading("creatingRun");
      setFormError(undefined);
      try {
        const response = await apiPostNewRun(payload);
        postNewRunState(normalizeRunData(response));
        await updateStats();
        router.push("/user/runs");
      } catch (err) {
        handleApiFormError(err, setFormError);
      } finally {
        setLoading("idle");
      }
    },
    [postNewRunState, router, updateStats],
  );

  const updateRun = useCallback(
    async (runId: string, payload: RunRequest) => {
      setLoading("updatingRun");
      setLoadingRunId(runId);
      setFormError(undefined);
      try {
        const response = await apiUpdateRun(runId, payload);
        updateRunState(normalizeRunData(response));
        await updateStats();
        router.back();
      } catch (err) {
        handleApiFormError(err, setFormError);
      } finally {
        setLoading("idle");
        setLoadingRunId(null);
      }
    },
    [updateRunState, router, updateStats],
  );

  const deleteRun = useCallback(
    async (runId: string) => {
      setLoading("deletingRun");
      setLoadingRunId(runId);
      setFormError(undefined);
      try {
        await apiDeleteRun(runId);
        deleteRunState(runId);
        await updateStats();
      } catch (err) {
        handleApiFormError(err, setFormError);
      } finally {
        setLoading("idle");
        setLoadingRunId(null);
      }
    },
    [deleteRunState, updateStats],
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
export type { LoadingState };
