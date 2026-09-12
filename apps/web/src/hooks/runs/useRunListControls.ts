import type { Run } from "@runera/shared";

import { useCallback, useMemo, useState } from "react";

type FilterOption = "all" | Run["runType"];

type SortOption =
  | "startTimeNewest"
  | "startTimeOldest"
  | "distanceLongest"
  | "distanceShortest"
  | "paceBest";

function useRunListControls(runsArray: Run[]) {
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("startTimeNewest");

  const filterRuns = useCallback(
    (runs: Run[]) => {
      if (filterBy === "all") return runs;
      return runs.filter((run) => run.runType === filterBy);
    },
    [filterBy],
  );

  const sortRuns = useCallback(
    (runs: Run[]) => {
      return [...runs].sort((a, b) => {
        switch (sortBy) {
          case "paceBest":
            return a.paceSecPerKm - b.paceSecPerKm;

          case "distanceLongest":
            return b.distanceKm - a.distanceKm;

          case "distanceShortest":
            return a.distanceKm - b.distanceKm;

          case "startTimeOldest":
            return (
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            );

          case "startTimeNewest":
            return (
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
            );
        }
      });
    },
    [sortBy],
  );

  const finalRunsArray = useMemo(() => {
    return sortRuns(filterRuns(runsArray));
  }, [runsArray, sortRuns, filterRuns]);

  return { filterBy, setFilterBy, sortBy, setSortBy, finalRunsArray };
}

export { useRunListControls };
