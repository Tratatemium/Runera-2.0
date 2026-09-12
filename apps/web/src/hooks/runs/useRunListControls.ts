import type { Run } from "@runera/shared";

import { useCallback, useMemo, useState } from "react";

const filterOptions = [
  { name: "all", label: "All" },
  { name: "base", label: "Base" },
  { name: "recovery", label: "Recovery" },
  { name: "tempo", label: "Tempo" },
  { name: "longRun", label: "Long Run" },
  { name: "interval", label: "Interval" },
  { name: "race", label: "Race" },
] as const;

type FilterOption = (typeof filterOptions)[number]["name"];

const sortOptions = [
  { name: "startTimeNewest", label: "Newest first" },
  { name: "startTimeOldest", label: "Oldest first" },
  { name: "distanceLongest", label: "Longest first" },
  { name: "distanceShortest", label: "Shortestt first" },
  { name: "paceBest", label: "Best pace" },
] as const;

type SortOption = (typeof sortOptions)[number]["name"];

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

  return {
    filterOptions,
    filterBy,
    setFilterBy,
    sortOptions,
    sortBy,
    setSortBy,
    finalRunsArray,
  };
}

export { useRunListControls };
