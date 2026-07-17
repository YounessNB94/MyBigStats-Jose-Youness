import type { Athlete } from "../athletes/athlete.types.js";
import type { ComparisonValue } from "./comparator.types.js";
import { comparisonMetrics } from "./comparator.types.js";
import {
  DifferentSportsError,
  MissingAthleteError,
  SameAthleteError
} from "./comparator.errors.js";

export function validateComparison(
  firstAthlete: Athlete | undefined,
  secondAthlete: Athlete | undefined
): void {
  if (!firstAthlete || !secondAthlete) {
    throw new MissingAthleteError();
  }

  if (firstAthlete.id === secondAthlete.id) {
    throw new SameAthleteError();
  }

  if (firstAthlete.sport_id !== secondAthlete.sport_id) {
    throw new DifferentSportsError();
  }
}

export function compareAthletes(
  firstAthlete: Athlete | undefined,
  secondAthlete: Athlete | undefined
): ComparisonValue[] {
  validateComparison(firstAthlete, secondAthlete);

  const first = firstAthlete!;
  const second = secondAthlete!;

  const firstStats = first.stats as unknown as Record<string, number>;
  const secondStats = second.stats as unknown as Record<string, number>;

  return comparisonMetrics[first.sport_id].map((metric) => ({
    label: metric.label,
    firstValue: firstStats[metric.key] ?? 0,
    secondValue: secondStats[metric.key] ?? 0
  }));
}
