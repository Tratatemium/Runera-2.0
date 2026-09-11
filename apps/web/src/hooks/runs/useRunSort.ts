import type { Run } from "@runera/shared";

import { useMemo, useState } from "react";

type SortOption =
  | "startTimeNewest"
  | "startTimeOldest"
  | "distanceLongest"
  | "distanceShortest"
  | "paceBest";

function useRunSort(runsArray: Run[]) {
  const [sortBy, setSortBy] = useState<SortOption>("startTimeNewest");

  const sortedRuns = useMemo(() => {
    const nextRuns = [...runsArray];

    switch (sortBy) {
      case "paceBest":
        return nextRuns.sort((a, b) => a.paceSecPerKm - b.paceSecPerKm);

      case "distanceLongest":
        return nextRuns.sort((a, b) => b.distanceKm - a.distanceKm);

      case "distanceShortest":
        return nextRuns.sort((a, b) => a.distanceKm - b.distanceKm);

      case "startTimeOldest":
        return nextRuns.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );

      case "startTimeNewest":
        return nextRuns.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        );
    }
  }, [sortBy, runsArray]);

  return { sortBy, setSortBy, sortedRuns };
}

export { useRunSort };
